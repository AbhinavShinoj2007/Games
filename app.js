const search = document.querySelector('#search');
const cards = [...document.querySelectorAll('.game-card')];
const empty = document.querySelector('#empty');

search.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const matches = card.dataset.name.includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  empty.classList.toggle('visible', visible === 0);
});
