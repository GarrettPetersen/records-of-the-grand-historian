(() => {
  'use strict';

  const tools = document.querySelector('[data-person-reference-tools]');
  if (!tools) return;

  const input = tools.querySelector('#person-reference-search');
  const bookSelect = tools.querySelector('#person-reference-book');
  const clearButton = tools.querySelector('[data-person-reference-clear]');
  const status = tools.querySelector('[data-person-reference-status]');
  const empty = document.querySelector('[data-person-reference-empty]');
  const groups = [...document.querySelectorAll('[data-person-reference-group]')];
  if (!input || !bookSelect || !clearButton || !status || !empty || !groups.length) {
    throw new Error('Person reference filters are missing required page elements');
  }

  const normalize = (value) => String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{Mark}+/gu, '')
    .toLocaleLowerCase()
    .replace(/\s+/gu, ' ')
    .trim();
  const total = groups.reduce(
    (count, group) => count + group.querySelectorAll('[data-person-reference-item]').length,
    0,
  );

  function update() {
    const query = normalize(input.value);
    const selectedBook = bookSelect.value;
    let visible = 0;
    for (const group of groups) {
      const bookMatches = !selectedBook || group.dataset.book === selectedBook;
      let groupMatches = 0;
      for (const item of group.querySelectorAll('[data-person-reference-item]')) {
        const textMatches = !query || normalize(item.textContent).includes(query);
        const matches = bookMatches && textMatches;
        item.hidden = !matches;
        if (matches) groupMatches += 1;
      }
      group.hidden = groupMatches === 0;
      if (query && groupMatches > 0) group.open = true;
      visible += groupMatches;
    }
    clearButton.hidden = !query;
    empty.hidden = visible !== 0;
    status.textContent = query || selectedBook
      ? `${visible.toLocaleString()} of ${total.toLocaleString()} passages`
      : `${total.toLocaleString()} ${total === 1 ? 'passage' : 'passages'}`;
  }

  input.addEventListener('input', update);
  bookSelect.addEventListener('change', update);
  clearButton.addEventListener('click', () => {
    input.value = '';
    input.focus();
    update();
  });
})();
