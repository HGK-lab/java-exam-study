// 장 화면(app.js)과 모의고사(exam.html)가 같이 쓰는 퀴즈 엔진
(function () {
  const PROF = '<span class="prof">(교수님 강조)</span>';
  const TYPE = { ox: 'OX', mcq: '객관식', output: '출력 예측', blank: '빈칸 고르기', error: '오류 찾기', code: '코드 빈칸', short: '단답형' };
  const NUM = '①②③④⑤⑥⑦⑧⑨⑩';

  // localStorage는 사생활 보호 모드 등에서 막힐 수 있다
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // 휴대폰 키보드는 둥근 따옴표를 넣고, 사람마다 띄어쓰기와 끝 세미콜론이 다르다
  const norm = s => String(s).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, '').replace(/;+$/, '');
  const normShort = s => norm(s).toLowerCase().replace(/\(\)$/, '');
  const alts = a => Array.isArray(a) ? a : [a];
  const blankOk = (input, ans) => alts(ans).some(x => norm(x) === norm(input));
  const shortOk = (input, q) => q.answers.some(x => normShort(x) === normShort(input));

  // 코드 속 {{1}}, {{2}} … 를 입력칸(또는 정답)으로 바꾼다
  function codeHtml(q, mode) {
    return esc(q.code).replace(/\{\{(\d+)\}\}/g, (_, n) => {
      const i = n - 1, mark = NUM[i] || n;
      if (mode === 'answer') return `<span class="fill">${esc(alts(q.blanks[i])[0])}</span>`;
      const w = Math.max(4, Math.min(28, norm(alts(q.blanks[i])[0]).length + 2));
      return `<span class="bnum">${mark}</span><input class="bin" data-i="${i}" style="width:${w}ch" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="빈칸 ${mark}">`;
    });
  }

  // 오답노트용: 정답이 드러난 문제 한 개
  function reviewHtml(q, label) {
    const head = `<div class="qtype">${label ? esc(label) + ' · ' : ''}${TYPE[q.type]} ${q.prof ? PROF : ''}</div><p class="qtext">${esc(q.q)}</p>`;
    if (q.type === 'code') return `${head}<pre class="codeq"><code>${codeHtml(q, 'answer')}</code></pre><div class="explain">${esc(q.explain)}</div>`;
    if (q.type === 'short') return `${head}<div>정답: <span class="ans">${esc(q.answers[0])}</span></div><div class="explain">${esc(q.explain)}</div>`;
    return `${head}${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ''}
      <div>정답: <span class="ans">${esc(q.choices[q.answer])}</span></div><div class="explain">${esc(q.explain)}</div>`;
  }

  /*
   * list: 풀 문제 배열. opts.wrongKey(q) → 오답을 저장할 localStorage 키,
   * opts.label(q) → 문제 위에 붙일 출처(모의고사에서 장 표시), opts.onEnd(right, total, byType) → 결과 화면 버튼 처리
   */
  function run(view, list, opts) {
    let i = 0, right = 0;
    const byType = {};
    function mark(q, ok) {
      const key = opts.wrongKey(q), w = store.get(key, {});
      if (ok) { right++; delete w[q.id]; } else w[q.id] = Date.now();
      store.set(key, w);
      const t = byType[TYPE[q.type]] = byType[TYPE[q.type]] || [0, 0];
      t[1]++; if (ok) t[0]++;
    }
    function after(q, ok) {
      view.querySelector('#after').innerHTML = `
        <div class="explain ${ok ? '' : 'bad'}"><b>${ok ? '정답!' : '오답'}</b> ${esc(q.explain)}</div>
        <div class="row" style="margin-top:12px"><button class="btn primary" id="nx">${i + 1 < list.length ? '다음 문제' : '결과 보기'}</button></div>`;
      view.querySelector('#nx').onclick = () => { i++; window.scrollTo(0, 0); draw(); };
    }
    function draw() {
      if (i >= list.length) { opts.onEnd(right, list.length, byType); return; }
      const q = list[i];
      const label = opts.label ? opts.label(q) : '';
      const head = `
        <div class="progress"><div style="width:${(i / list.length) * 100}%"></div></div>
        <div class="qcard">
          <div class="qtype">${i + 1} / ${list.length} · ${label ? esc(label) + ' · ' : ''}${TYPE[q.type]} ${q.prof ? PROF : ''}</div>
          <p class="qtext">${esc(q.q)}</p>`;

      if (q.type === 'code') {
        view.innerHTML = `${head}
          <pre class="codeq"><code>${codeHtml(q)}</code></pre>
          <div class="row"><button class="btn primary" id="grade">채점</button></div>
          <div id="after"></div></div>`;
        const inputs = [...view.querySelectorAll('.bin')];
        view.querySelector('#grade').onclick = () => {
          let all = true;
          inputs.forEach(inp => {
            const ans = q.blanks[+inp.dataset.i], ok = blankOk(inp.value, ans);
            all = all && ok;
            inp.disabled = true;
            inp.classList.add(ok ? 'ok' : 'no');
            if (!ok) inp.insertAdjacentHTML('afterend', `<span class="fix">${esc(alts(ans)[0])}</span>`);
          });
          view.querySelector('#grade').parentElement.remove();
          mark(q, all); after(q, all);
        };
        return;
      }

      if (q.type === 'short') {
        view.innerHTML = `${head}
          <input class="sin" id="sin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="답 입력">
          <div class="row" style="margin-top:10px"><button class="btn primary" id="grade">채점</button></div>
          <div id="after"></div></div>`;
        const inp = view.querySelector('#sin');
        const grade = () => {
          const ok = shortOk(inp.value, q);
          inp.disabled = true; inp.classList.add(ok ? 'ok' : 'no');
          view.querySelector('#grade').parentElement.remove();
          mark(q, ok); after(q, ok);
          if (!ok) {
            // 표기만 다르고 뜻이 맞는 경우를 위해 스스로 정답 처리할 수 있게 한다
            view.querySelector('#after').insertAdjacentHTML('afterbegin',
              `<div class="explain">정답: <b>${esc(q.answers[0])}</b> <button class="chip" id="selfok">맞은 걸로 처리</button></div>`);
            view.querySelector('#selfok').onclick = e => {
              const key = opts.wrongKey(q), w = store.get(key, {});
              delete w[q.id]; store.set(key, w);
              right++; byType[TYPE[q.type]][0]++;
              e.target.replaceWith('맞음으로 바꿨어요');
            };
          }
        };
        view.querySelector('#grade').onclick = grade;
        inp.onkeydown = e => { if (e.key === 'Enter') grade(); };
        inp.focus();
        return;
      }

      const order = q.type === 'ox' ? [0, 1] : shuffle(q.choices.map((_, k) => k));
      const mono = q.type === 'output' || q.type === 'blank' || q.mono;
      view.innerHTML = `${head}
          ${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ''}
          <div class="choices">${order.map(k => `<button class="choice ${mono ? 'mono' : ''}" data-k="${k}">${esc(q.choices[k])}</button>`).join('')}</div>
          <div id="after"></div>
        </div>`;
      view.querySelectorAll('.choice').forEach(b => b.onclick = () => {
        const k = +b.dataset.k, ok = k === q.answer;
        view.querySelectorAll('.choice').forEach(x => {
          x.disabled = true;
          if (+x.dataset.k === q.answer) x.classList.add('correct');
        });
        if (!ok) b.classList.add('wrong');
        mark(q, ok); after(q, ok);
      });
    }
    window.scrollTo(0, 0);
    draw();
  }

  window.Quiz = { PROF, TYPE, store, esc, shuffle, run, reviewHtml, blankOk, shortOk };
})();
