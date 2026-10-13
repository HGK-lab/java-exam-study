(function () {
  const params = new URLSearchParams(location.search);
  const chId = params.get('ch') || '07';
  const meta = window.CHAPTER_LIST.find(c => c.id === chId);
  const view = document.getElementById('view');
  const PROF = '<span class="prof">(교수님 강조)</span>';

  if (!meta || !meta.ready) {
    view.innerHTML = '<p class="empty">아직 준비되지 않은 장입니다. <a href="index.html">홈으로</a></p>';
    return;
  }

  const s = document.createElement('script');
  s.src = `data/ch${chId}.js`;
  s.onload = () => start(window.CHAPTER_DATA[chId]);
  document.body.appendChild(s);

  // localStorage는 사생활 보호 모드 등에서 막힐 수 있다
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const wrongKey = 'wrong-' + chId;
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function start(data) {
    document.getElementById('ctitle').textContent = `${meta.no}장 ${meta.title}`;
    document.title = `${meta.no}장 ${meta.title} · 자바심화`;
    const tabs = { summary: renderSummary, cards: renderCards, quiz: renderQuiz, wrong: renderWrong };
    const buttons = document.querySelectorAll('.tabs button');
    function go(tab) {
      buttons.forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
      store.set('tab-' + chId, tab);
      window.scrollTo(0, 0);
      tabs[tab](data);
    }
    buttons.forEach(b => b.onclick = () => go(b.dataset.tab));
    go(tabs[store.get('tab-' + chId)] ? store.get('tab-' + chId) : 'summary');
  }

  /* ---------- 요약 ---------- */
  function renderSummary(data) {
    let onlyProf = false;
    function draw() {
      const secs = data.sections.filter(x => !onlyProf || x.prof);
      view.innerHTML = `
        <div class="toolbar">
          <button class="chip ${onlyProf ? 'on' : ''}" id="pf">★ 교수님 강조만</button>
          <button class="chip" id="openAll">모두 펼치기</button>
          <button class="chip" id="closeAll">모두 접기</button>
        </div>
        ${secs.map(x => `
          <details class="sec" ${x.open ? 'open' : ''}>
            <summary>${esc(x.title)} ${x.prof ? PROF : ''}</summary>
            <div class="body">${x.html.replaceAll('{{PROF}}', PROF)}</div>
          </details>`).join('')}`;
      view.querySelector('#pf').onclick = () => { onlyProf = !onlyProf; draw(); };
      view.querySelector('#openAll').onclick = () => view.querySelectorAll('details').forEach(d => d.open = true);
      view.querySelector('#closeAll').onclick = () => view.querySelectorAll('details').forEach(d => d.open = false);
    }
    draw();
  }

  /* ---------- 암기카드 ---------- */
  function renderCards(data) {
    let onlyProf = false, deck = data.cards.slice(), i = 0;
    function draw() {
      const c = deck[i];
      view.innerHTML = `
        <div class="toolbar">
          <button class="chip ${onlyProf ? 'on' : ''}" id="pf">★ 교수님 강조만</button>
          <button class="chip" id="mix">섞기</button>
        </div>
        <div class="counter">${i + 1} / ${deck.length}</div>
        <div class="flash"><div class="fcard" id="fc">
          <div class="face front">${c.prof ? PROF : ''}<div class="q">${esc(c.q)}</div><div class="hint">탭해서 뒤집기</div></div>
          <div class="face back">${c.prof ? PROF : ''}<div class="a">${esc(c.a)}</div>${c.note ? `<div class="hint">${esc(c.note)}</div>` : ''}</div>
        </div></div>
        <div class="row">
          <button class="btn" id="prev">이전</button>
          <button class="btn primary" id="next">다음</button>
        </div>`;
      const fc = view.querySelector('#fc');
      fc.onclick = () => fc.classList.toggle('flip');
      view.querySelector('#prev').onclick = () => { i = (i - 1 + deck.length) % deck.length; draw(); };
      view.querySelector('#next').onclick = () => { i = (i + 1) % deck.length; draw(); };
      view.querySelector('#mix').onclick = () => { deck = shuffle(deck); i = 0; draw(); };
      view.querySelector('#pf').onclick = () => {
        onlyProf = !onlyProf;
        deck = data.cards.filter(x => !onlyProf || x.prof);
        i = 0; draw();
      };
    }
    draw();
  }

  /* ---------- 퀴즈 ---------- */
  const TYPE = { ox: 'OX', mcq: '객관식', output: '출력 예측', blank: '빈칸 채우기', error: '오류 찾기' };

  function renderQuiz(data, preset) {
    if (!preset) {
      const wrongN = Object.keys(store.get(wrongKey, {})).length;
      const profN = data.quiz.filter(q => q.prof).length;
      view.innerHTML = `
        <div class="qcard">
          <p class="qtext">문제 범위를 고르세요</p>
          <div class="choices">
            <button class="choice" data-m="all">전체 문제 (${data.quiz.length}문항, 무작위)</button>
            <button class="choice" data-m="prof">교수님 강조만 (${profN}문항)</button>
            <button class="choice" data-m="output">출력 예측·오류 찾기만</button>
            <button class="choice" data-m="wrong" ${wrongN ? '' : 'disabled'}>오답만 다시 풀기 (${wrongN}문항)</button>
          </div>
        </div>`;
      view.querySelectorAll('[data-m]').forEach(b => b.onclick = () => {
        const m = b.dataset.m, w = store.get(wrongKey, {});
        const pool = data.quiz.filter(q =>
          m === 'all' || (m === 'prof' && q.prof) || (m === 'wrong' && w[q.id]) ||
          (m === 'output' && (q.type === 'output' || q.type === 'error')));
        renderQuiz(data, shuffle(pool));
      });
      return;
    }
    let i = 0, right = 0;
    function draw() {
      if (i >= preset.length) {
        view.innerHTML = `<div class="qcard score"><div class="big">${right} / ${preset.length}</div>
          <p>${right === preset.length ? '전부 맞혔어요!' : '틀린 문제는 오답노트에 저장됐어요.'}</p>
          <div class="row"><button class="btn" id="again">다시 고르기</button><button class="btn primary" id="toWrong">오답노트</button></div></div>`;
        view.querySelector('#again').onclick = () => renderQuiz(data);
        view.querySelector('#toWrong').onclick = () => document.querySelector('[data-tab=wrong]').click();
        return;
      }
      const q = preset[i];
      const order = q.type === 'ox' ? [0, 1] : shuffle(q.choices.map((_, k) => k));
      const mono = q.type === 'output' || q.type === 'blank' || q.mono;
      view.innerHTML = `
        <div class="progress"><div style="width:${(i / preset.length) * 100}%"></div></div>
        <div class="qcard">
          <div class="qtype">${i + 1} / ${preset.length} · ${TYPE[q.type]} ${q.prof ? PROF : ''}</div>
          <p class="qtext">${esc(q.q)}</p>
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
        const w = store.get(wrongKey, {});
        if (ok) { right++; delete w[q.id]; } else { b.classList.add('wrong'); w[q.id] = Date.now(); }
        store.set(wrongKey, w);
        view.querySelector('#after').innerHTML = `
          <div class="explain ${ok ? '' : 'bad'}"><b>${ok ? '정답!' : '오답'}</b> ${esc(q.explain)}</div>
          <div class="row" style="margin-top:12px"><button class="btn primary" id="nx">${i + 1 < preset.length ? '다음 문제' : '결과 보기'}</button></div>`;
        view.querySelector('#nx').onclick = () => { i++; draw(); };
      });
    }
    draw();
  }

  /* ---------- 오답노트 ---------- */
  function renderWrong(data) {
    const w = store.get(wrongKey, {});
    const list = data.quiz.filter(q => w[q.id]).sort((a, b) => w[b.id] - w[a.id]);
    if (!list.length) { view.innerHTML = '<p class="empty">오답이 없습니다. 퀴즈를 풀면 틀린 문제가 여기에 모여요.</p>'; return; }
    view.innerHTML = `
      <div class="row" style="margin-bottom:12px">
        <button class="btn primary" id="retry">오답 ${list.length}문항 다시 풀기</button>
        <button class="btn" id="clear">비우기</button>
      </div>
      ${list.map(q => `<div class="wrong-item">
        <div class="qtype">${TYPE[q.type]} ${q.prof ? PROF : ''}</div>
        <p class="qtext">${esc(q.q)}</p>
        ${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ''}
        <div>정답: <span class="ans">${esc(q.choices[q.answer])}</span></div>
        <div class="explain">${esc(q.explain)}</div>
      </div>`).join('')}`;
    view.querySelector('#retry').onclick = () => {
      document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === 'quiz'));
      renderQuiz(data, shuffle(list));
    };
    view.querySelector('#clear').onclick = () => { store.set(wrongKey, {}); renderWrong(data); };
  }
})();
