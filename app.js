import makeModal from './makeModal.js';

const cardNames = [
  'bear',
  'bill',
  'blaster',
  'diary',
  'dragon',
  'fighter',
];

const state = {
  flippedCards: {
    flippedCardsCount: null,
    flippedCollection: null,
  },
  hiddenCardsCount: null,
  gameState: null
};

const makeCardpool = () => {
  const shuffleCards = (cardNames) => {
    return [...cardNames, ...cardNames]
      .sort(() => (0.5 - Math.random()));
  };
  const shuffledCards = shuffleCards(cardNames);
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
  state.gameState = 'in progress';
};


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const updateCardsState = () => {
  const flippedCards = document.querySelectorAll('[data-flip="true"]');
  state.flippedCards.flippedCardsCount = flippedCards.length;
  state.flippedCards.flippedCollection = [...flippedCards];
  console.log(state);
};

const checkFlippedCardsCount = () => state.flippedCards.flippedCardsCount == 2;

const checkIdentity = () => {
  const [first, second] = state.flippedCards.flippedCollection.map(el => el.dataset.cardId);
  return first === second;
}

const CheckToWin = () => document.querySelectorAll('.hidden').length === 12;

const flipCard = (card) => {
    card.classList.add('flip');
    card.dataset.flip = 'true';
    updateCardsState();
};

const hideCards = () => {
  state.flippedCards.flippedCollection.forEach(card => {
    card.dataset.flip = 'false';
    card.classList.add('hidden');
    card.removeEventListener('click', handler);
  });
  updateCardsState();
}

const unFlip = async () => {
  await sleep(500);
  state.flippedCards.flippedCollection.forEach((el) => {
    el.classList.remove('flip');
    el.dataset.flip = 'false';
  });
  updateCardsState();
};

const endGame = async () => {
  await sleep(500);
  makeModal();
}

const render = (state) => {
  if(!state.gameState) makeCardpool();
  if(state.gameState === 'end') endGame();
};

const handler = ({ target }) => {
  const card = target.closest('.card');

  if (!checkFlippedCardsCount()) {
    flipCard(card);
  }

  if (checkFlippedCardsCount()) {
    if (checkIdentity()) {
      hideCards();
    }
    else {
      unFlip();
    }
  }

  if (CheckToWin()) state.gameState = 'end';

  render(state);
};


export default () => {
  render(state);
  
  const cards = document.querySelectorAll('.card');
  cards.forEach((el) => el.addEventListener('click', handler));
};



