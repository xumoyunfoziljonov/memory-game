import * as state from './state.js';
import * as ui from './ui.js';
import { makeCards } from './cards.js';
import { formatTime } from './utils.js';

// O'yinni boshlash
export function startGame() {
  state.resetGame();
  
  let cards = makeCards();
  state.setAllCards(cards);
  
  ui.hideSettings();
  ui.renderCards(cards, clickCard);
  ui.updateTime(0);
  ui.updateMoves(0);
  
  if (state.playersCount > 1) {
    state.initPlayerScores();
  }
  ui.renderPlayers();
  
  // Taymerni ishga tushirish
  let interval = setInterval(function() {
    state.incrementTime();
    ui.updateTime(state.timeSeconds);
  }, 1000);
  state.setTimerInterval(interval);
}

// Kartaga bosish
export function clickCard(index) {
  if (ui.isCardActive(index) || state.isChecking) {
    return;
  }
  
  ui.flipCard(index);
  state.addOpenCard(index);
  
  if (state.openCards.length === 2) {
    state.setIsChecking(true);
    checkCards();
  }
}

// Kartalarni tekshirish
function checkCards() {
  let index1 = state.openCards[0];
  let index2 = state.openCards[1];
  
  state.incrementMoves();
  ui.updateMoves(state.movesCount);
  
  let isMatch = state.allCards[index1] === state.allCards[index2];
  
  setTimeout(function() {
    if (isMatch) {
      ui.markCardAsMatched(index1);
      ui.markCardAsMatched(index2);
      state.incrementFoundPairs();
      
      if (state.playersCount > 1) {
        state.incrementPlayerScore(state.currentPlayerIndex);
        ui.updatePlayerScore(state.currentPlayerIndex, state.playerScores[state.currentPlayerIndex]);
      }
      
      if (state.foundPairs === state.allCards.length / 2) {
        finishGame();
      }
    } else {
      setTimeout(function() {
        ui.unflipCard(index1);
        ui.unflipCard(index2);
      }, 500);
      
      if (state.playersCount > 1) {
        state.nextPlayer();
        ui.setActivePlayer(state.currentPlayerIndex);
      }
    }
    
    state.clearOpenCards();
    state.setIsChecking(false);
  }, 600);
}

// O'yinni tugatish
function finishGame() {
  state.clearTimer();
  
  setTimeout(function() {
    let timeStr = formatTime(state.timeSeconds);
    ui.showResult(timeStr, state.movesCount);
  }, 500);
}