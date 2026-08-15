(() => {
  const container = document.getElementById('person-family-chart');
  const dataElement = document.getElementById('person-family-data');
  if (!container || !dataElement) return;

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/gu, '&amp;')
      .replace(/</gu, '&lt;')
      .replace(/>/gu, '&gt;')
      .replace(/"/gu, '&quot;')
      .replace(/'/gu, '&#039;');
  }

  try {
    if (!window.f3?.createChart) throw new Error('Family Chart did not load');
    const data = JSON.parse(dataElement.textContent);
    if (!Array.isArray(data) || data.length < 2) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chart = window.f3.createChart(container, data)
      .setTransitionTime(reducedMotion ? 0 : 450)
      .setCardXSpacing(225)
      .setCardYSpacing(130)
      .setSingleParentEmptyCard(false)
      .setShowSiblingsOfMain(true);
    chart.setCardHtml()
      .setStyle('rect')
      .setCardDim({ w: 196, h: 104, height_auto: false })
      .setCardInnerHtmlCreator((datum) => {
        const person = datum.data.data;
        return `<a class="family-tree-card${person.current ? ' is-current' : ''}" href="${escapeHtml(person.href)}">
          <strong>${escapeHtml(person.name)}</strong>
          ${person.zh ? `<span lang="zh-Hant">${escapeHtml(person.zh)}</span>` : ''}
          <small>${escapeHtml(person.life)}</small>
        </a>`;
      })
      .setOnCardClick((event, datum) => {
        const href = datum.data.data.href;
        if (href && !event.target.closest('a')) window.location.assign(href);
      });
    chart.updateTree({ initial: true, tree_position: 'fit' });
    const viewport = container.closest('.person-family-tree-viewport');
    if (viewport && viewport.scrollWidth > viewport.clientWidth) window.requestAnimationFrame(() => {
      const currentCard = container.querySelector('.family-tree-card.is-current');
      if (!currentCard) throw new Error('Family tree does not contain the current person');
      const viewportRect = viewport.getBoundingClientRect();
      const cardRect = currentCard.getBoundingClientRect();
      viewport.scrollLeft += cardRect.left + cardRect.width / 2 - viewportRect.left - viewportRect.width / 2;
    });
  } catch (error) {
    console.error(error);
    container.closest('.person-family-tree-shell')?.classList.add('is-unavailable');
  }
})();
