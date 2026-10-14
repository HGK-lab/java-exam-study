(function () {
  const params = new URLSearchParams(location.search);
  const chId = params.get('ch') || '07';
  const meta = window.CHAPTER_LIST.find(c => c.id === chId);
  const view = document.getElementById('view');
  const PROF = Quiz.PROF;

  if (!meta || !meta.ready) {
    view.innerHTML = '<p class="empty">아직 준비되지 않은 장입니다. <a href="index.html">홈으로</a></p>';
    return;
  }

  const s = document.createElement('script');
  s.src = `data/ch${chId}.js`;
  s.onload = () => start(window.CHAPTER_DATA[chId]);
  document.body.appendChild(s);

  const { store, esc, shuffle } = Quiz;
  const wrongKey = 'wrong-' + chId;

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
    // 시험 범위 페이지에서 #섹션id 로 들어오면 요약 탭의 그 섹션을 연다
    const target = location.hash.slice(1);
    go(target ? 'summary' : tabs[store.get('tab-' + chId)] ? store.get('tab-' + chId) : 'summary');
    const el = target && document.getElementById(target);
    if (el) { el.open = true; el.scrollIntoView(); }
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
          <details class="sec" ${x.id ? `id="${x.id}"` : ''} ${x.open ? 'open' : ''}>
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
  const MODES = [
    ['all', q => true, n => `전체 문제 (${n}문항, 무작위)`],
    ['prof', q => q.prof, n => `교수님 강조만 (${n}문항)`],
    ['code', q => q.type === 'code', n => `코드 빈칸만 (${n}문항)`],
    ['short', q => q.type === 'short', n => `단답형만 (${n}문항)`],
    ['output', q => q.type === 'output' || q.type === 'error', n => `출력 예측·오류 찾기만 (${n}문항)`],
  ];

  function renderQuiz(data, preset) {
    if (!preset) {
      const w = store.get(wrongKey, {});
      const wrongN = data.quiz.filter(q => w[q.id]).length;
      view.innerHTML = `
        <div class="qcard">
          <p class="qtext">문제 범위를 고르세요</p>
          <div class="choices">
            ${MODES.map(([m, f, label]) => {
              const n = data.quiz.filter(f).length;
              return n ? `<button class="choice" data-m="${m}">${label(n)}</button>` : '';
            }).join('')}
            <button class="choice" data-m="wrong" ${wrongN ? '' : 'disabled'}>오답만 다시 풀기 (${wrongN}문항)</button>
          </div>
        </div>`;
      view.querySelectorAll('[data-m]').forEach(b => b.onclick = () => {
        const m = b.dataset.m, w = store.get(wrongKey, {});
        const f = m === 'wrong' ? q => w[q.id] : MODES.find(x => x[0] === m)[1];
        renderQuiz(data, shuffle(data.quiz.filter(f)));
      });
      return;
    }
    Quiz.run(view, preset, {
      wrongKey: () => wrongKey,
      onEnd(right, total) {
        view.innerHTML = `<div class="qcard score"><div class="big">${right} / ${total}</div>
          <p>${right === total ? '전부 맞혔어요!' : '틀린 문제는 오답노트에 저장됐어요.'}</p>
          <div class="row"><button class="btn" id="again">다시 고르기</button><button class="btn primary" id="toWrong">오답노트</button></div></div>`;
        view.querySelector('#again').onclick = () => renderQuiz(data);
        view.querySelector('#toWrong').onclick = () => document.querySelector('[data-tab=wrong]').click();
      },
    });
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
      ${list.map(q => `<div class="wrong-item">${Quiz.reviewHtml(q)}</div>`).join('')}`;
    view.querySelector('#retry').onclick = () => {
      document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === 'quiz'));
      renderQuiz(data, shuffle(list));
    };
    view.querySelector('#clear').onclick = () => { store.set(wrongKey, {}); renderWrong(data); };
  }
})();
