const cardNames = [
  'bear',
  'bill',
  'blaster',
  'diary',
  'dragon',
  'fighter',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeCardpool = (cardNames) => {
  return [...cardNames, ...cardNames]
    .sort(() => (0.5 - Math.random()));
};

const render = () => {
  const shuffledCards = makeCardpool(cardNames);
  const cardsContainer = document.querySelector('.cards-container');

  const cardTemplate = (cardName) => `
  <div class="card" data-card-id="${cardName}" data-flip="false">
  <div class="card-back">
    <img src="./resources/gf-pics/${cardName}.png" alt="flag" class="card-img" />
  </div>
  <div class="card-front">
  </div>
  </div>
`;

  shuffledCards.forEach((cardName) => {
    cardsContainer.innerHTML += cardTemplate(cardName);
  });
};

const seekFlippedCards = () => document.querySelectorAll('[data-flip="true"]');

const checkFlippedCardsCount = () => seekFlippedCards().length === 2;

const checkIdentity = () =>
  seekFlippedCards()[0].dataset.cardId === seekFlippedCards()[1].dataset.cardId;

const CheckToWin = () => document.querySelectorAll('.hidden').length === 12;

const flipCard = (card) => {
  if (!checkFlippedCardsCount()) {
    card.classList.add('flip');
    card.dataset.flip = 'true';
  }
  if (checkFlippedCardsCount()) {
    if (checkIdentity()) {
      seekFlippedCards().forEach((el) => {
        el.removeEventListener('click', handler);
        el.classList.add('hidden');
      });
      console.log(CheckToWin())
    }
    unFlip();
  }
};

const unFlip = async () => {
  await sleep(500);
  seekFlippedCards().forEach((el) => {
    el.classList.remove('flip');
    el.dataset.flip = 'false';
  });
};


const handler = ({ target }) => {
  const card = target.closest('.card');
  flipCard(card);
};

render();

document
  .querySelectorAll('.card')
  .forEach((el) => el.addEventListener('click', handler));

