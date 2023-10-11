////// Global Variables
var cardDeckObj = {};
// For Player
var playerDeck = [];
var playerHand = [];
var playerSum = 0;
// For Dealer
var dealerDeck = [];
var dealerHand = [];
var dealerSum = 0;
// For Games against Dealer
var gameType = 0;
var turn = "";
var bet = 0;
var wallet = 0;

////// Functions
// [Function] Make an array of card deck with 52 cards
function generate52Cards() {
  var deck = [];
  var suits = ["C", "S", "D", "H"];
  var ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < ranks.length; j++) {
      deck.push(suits[i] + ranks[j]);
    };
  };
  return deck;
};

// [Function] Make an object of the 52 cards (property = card: number value)
function createCardDeckObj() {
  var numbers = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  // make property values (number)
  var numberValue = numbers.concat(numbers).concat(numbers.concat(numbers));
  // connect keys and values
  for (var i = 0; i < playerDeck.length; i++) {
    var a = playerDeck[i];
    var b = numberValue[i];
    cardDeckObj[a] = b;
  };
  return cardDeckObj;
};

// [Function] Delete the dealt card
function removeCard(deck, card) {
  var index = deck.indexOf(card);
  deck = deck.slice(0, index).concat(deck.slice(index + 1));
  return deck;
};

// [Function] Deal the first card
function dealFirstCard(deck, hand) {
  this.firstCard = deck[Math.floor(Math.random() * deck.length)];
  hand.push(this.firstCard);
  deck = removeCard(deck, this.firstCard);
  return deck;
};

// [Function] Deal the second card
function dealSecondCard(deck, hand) {
  this.secondCard = deck[Math.floor(Math.random() * deck.length)];
  hand.push(this.secondCard);
  deck = removeCard(deck, this.secondCard);
  return deck;
};

// [Function] Sum the hand
function sumHand(hand) {
  var sum = 0;
  hand.forEach(function(card) {
    sum += cardDeckObj[card];
  });
  if (sum > 21) {
    hand.forEach(function(card) {
      if (card==="C1" || card==="S1" || card==="D1" || card==="H1" && sum > 21) {
        sum -= 10;
      };
    });
  };
  return sum;
};

////// Play against a dealer
// 2.1. Decide the bet
function playerBet(money) {
  wallet += money;
  // enter the bet
  var decideBet = prompt("You have $" + wallet + " in your wallet.\nHow much do you want to bet?\n \nThe minimum bet is $10, and the bet has to be increments of $10.", "Type the number without $");
  if (decideBet > wallet) {
    alert("Don't be silly! You have only $" + wallet + " to bet!");
    return playerBet(0);
  } else if (decideBet <= wallet) {
    if (decideBet < 10) {
      alert("The minimum bet is $10. Plese type the number more than 10.");
      return playerBet(0);
    } else if (decideBet % 10 !== 0) {
      alert("You can only bet in multiples of 10.");
      return playerBet(0);
    } else if (decideBet >= 10 && (decideBet % 10 === 0)) {
      bet = decideBet;
      wallet -= bet;
      alert("Your bet is $" + bet + " in this game.\nYou have now $" + wallet + " in your wallet.");
      return deal2Cards_D();
    };
  } else if (decideBet) {
    alert("Incorrect input. Try again.")
    return playerBet(0);
  };
};

// 2.2. Dealer: Deal the first 2 cards and delete them from the card deck (show one card to the player)
function deal2Cards_D() {
  // reset the card deck and sum for dealer
  dealerDeck = generate52Cards();
  dealerHand = [];
  dealerSum = 0;
  turn = "dealer";
  // First card
  dealerDeck = dealFirstCard(dealerDeck, dealerHand);
  // Second card
  dealerDeck = dealSecondCard(dealerDeck, dealerHand);
  // show one of the dealer's card to player 
  alert("First, the dealer gets 2 cards.");
  alert("One of the dealer's card is [" + this.firstCard + "]");
  alert("Now, you get the first 2 cards.");
  // Player's turn (use the same functions as single play)
  return deal2Cards();
};

// 6. Dealer: get next cards
function dealer() {
  turn = "dealer";
  dealerSum = sumHand(dealerHand);
  // Comment after the player's turn
  if (dealerDeck.length === 50) {
    alert("Now dealer's turn.");
  };
  alert("Dealer's cards: [" + dealerHand + "]\nThe sum of dealer's cards = " + dealerSum);
  // if the sum is exactly 21 points:
  if (dealerSum === 21) {
    if (dealerDeck.length === 50) {
      alert("Oh no, he got Black Jack!!!");
    } else {
      alert("Oh no, he got exactly 21 points!");
    };
    return playerVSdealer();
  // if the sum is over 21
  } else if (dealerSum > 21) {
    alert("He busts! yeahhhhhhhhh!!!");
    return playerVSdealer();
  // dealer hit
  } else if (dealerSum <= 16) {
    alert("He has to hit.");
    var hitCard = dealerDeck[Math.floor(Math.random() * dealerDeck.length)];
    dealerHand.push(hitCard);
    dealerDeck = removeCard(dealerDeck, hitCard);
    alert("His next card is [" + hitCard + "]");
    return dealer();
  // dealer stands  
  } else if (dealerSum > 16) {
    alert("He has to stand.");
    return playerVSdealer();
  };
};

// 7.Compare the points (player and dealer)
function playerVSdealer() {
  alert("The final points:\nYou [" + playerSum + "] VS [" + dealerSum + "] Dealer");
  if (playerSum > 21 && dealerSum > 21) {
    alert("Both bust! The game was push (draw).");
    return betResult("push");
  } else if (playerSum <= 21 && dealerSum > 21) {
    alert("You win because dealer busts!");
    return betResult("win");
  } else if (playerSum > dealerSum) {
    alert("You win! Congratulations!!");
    return betResult("win");
  } else if (playerSum < dealerSum) {
    alert("You lose.... Don't cry!");
    return betResult("lose");
  } else if (playerSum === dealerSum) {
    alert("Same points. The game was push (draw).");
    return betResult("push");
  };
};

// 8.Return the bet
function betResult(result) {
  if (result === "win") {
    alert("Your bet $" + bet + " is now doubled $" + (bet * 2) + "! Hooray!!")
    bet *= 2;
    wallet += bet;
  } else if (result === "lose") {
    alert("Your bet $" + bet + " is taken by the dealer. Oh no.... ");
  } else if (result === "push") {
    alert("Because the game was draw, your bet $" + bet + " comes back to your wallet.")
    wallet += Number(bet);
  };
  alert("You have now $" + wallet + " in your wallet.");
  return dealerRepeat();

};

// 9.Ask to repeat the game with dealer
function dealerRepeat() {
  // if the wallet = 0:
  if (wallet == 0) {
    alert("You broke! No more money left to play....");
    return chooseGameType();
  };
  var playMore = prompt("Do you want to keep betting? Type one number:\n[1]Yes, let's!\n[2]No, I want to finish this game and start new one.\n[3]Quit Blackjack.", "Type 1, 2 or 3")
  if (playMore === "1") {
    return playerBet(0);
  } else if (playMore === "2") {
    var response = prompt("The money in your wallet will NOT be saved. Are you sure to quit the game?\n[1]Yes\n[2]No", "Type 1 or 2");
    if (response === "1") {
      return chooseGameType();
    } else {
      return dealerRepeat();
    };
  } else {
    var response = prompt("The money in your wallet will NOT be saved. Are you sure to quit Black Jack?\n[1]Yes\n[2]No", "Type 1 or 2");
    if (response === "1") {
      alert("Thank you for playing, have a good day!");
      return;
    } else {
      return dealerRepeat();
    };
  };
};

////// Single Play
// 1.Choose the game type 
function chooseGameType() {
  // reset the game type
  gameType = 0;
  // create the 52 cards and number values
  playerDeck = [];
  playerDeck = generate52Cards();
  createCardDeckObj();
  // choose the game type
  alert("*** Black Jack ***\n*** Welcome! ***");
  var ask = prompt("How do you want to play today? Type one number:\n[1]Single Play (get 21 Points or less)\n[2]Play against a dealer\n[3]Check the basic rule of Blackjack\n[4]Don't feel like to play", "1, 2, 3 or 4?");
  if (ask === "1") {
    return confirm(1);
  } else if (ask === "2") {
    gameType = 1;
    return confirm(2);
  } else if (ask === "3") {
    alert("-The goal of the Blackjack game is to get your cards to tally up to 21 points.\n-Card numbers 2 to 9 will count as their corresponding card number.\n-10, Jack(11), Queen(12) and King(13) all count as 10 points.\n-Ace(1) can count as either 1 or 11.\n-At the start of the game, the player is dealt 2 cards.\n- The player then has the choice to either stand (stop receiving new cards) or hit (receive 1 new card or more).\n-A 10 (10, J, Q, K) card with an Ace card is called a Blackjack. Blackjack is higher than other combinations of 21 points (2, 9, 10 etc.)\n-Once the sum of the cards gets over 21 points, the player busts and the game will be over.");
    return chooseGameType();
  } else if (ask === "4") {
    return alert("Then, have a good day!");
  } else if (ask) {
    alert("Please choose ONE NUMBER from 1, 2, 3 and 4!");
    return chooseGameType();
  };
};

// 2.Confirm the game type
function confirm(num) {
  if (num === 1) {
    alert("You play a single game of Blackjack.\n \nIf you get over 21 points, the game is over.\nTry to get 21 or under!")
    return deal2Cards();
  } else if (num === 2) {
    // reset bet and wallet
    bet = 0;
    wallet = 0;
    alert("Let's play against a dealer!")
    return playerBet(100);
  };
};

// 3.Deal the first 2 cards and delete them from the card deck
function deal2Cards() {
  // reset player's card deck and sum
  playerDeck = generate52Cards();
  playerHand = [];
  playerSum = 0;
  turn = "player";
  // First card
  playerDeck = dealFirstCard(playerDeck, playerHand);
  // Second card
  playerDeck = dealSecondCard(playerDeck, playerHand);
  alert("...Now dealing...");
  alert("Open the cards!");
  alert("The first 2 cards are [" + this.firstCard + " and " + this.secondCard + "]");
  playerSum = sumHand(playerHand);
  return judgment();
}

// 4. Judge the sum
function judgment() {
  alert("You cards: [" + playerHand + "]\nThe sum of the cards = " + playerSum);
  if (playerSum === 21) {
    if (playerDeck.length === 50) {
      alert("Wow, you've got Black Jack!!!\nSo cool!!!");
    } else {
      alert("Wow, you've got exactly 21 points! Nice!");
    };
    if (gameType === 1) {
      return dealer();
    } else {
      return repeat();
    };
  } else if (playerSum > 21) {
    alert("Booooooooom! You bust!");
    if (gameType === 1) {
      alert("You lose....");
      return betResult("lose");
    } else {
      return repeat();
    };
  } else if (playerSum < 21) {
    return standOrHit();
  };
};

// 5.Choose Stand or Hit
function standOrHit() {
  var ask = prompt("Do you want to stand, or hit? Type 1 or 2!\n(Your sum is now = " + playerSum + ")\n[1]Stand (stop to get a card)\n[2]Hit (get more card and gain the points)", "Type 1 or 2");
  // Stand
  if (ask === "1") {
    alert("Your final points = " + playerSum + "\n" + (21 - playerSum) + " more point(s) for 21.");
    if (gameType === 1) {
      return dealer();
    } else {
      return repeat();
    };
  // Hit
  } else if (ask === "2") {
    return hit();
  } else {
    alert("Please type 1 or 2!")
    return standOrHit();
  };
};

// 5.5.Hit
function hit() {
  turn = "player";
  var hitCard = playerDeck[Math.floor(Math.random() * playerDeck.length)];
  playerHand.push(hitCard);
  playerDeck = removeCard(playerDeck, hitCard);
  alert("Your next card is: [" + hitCard + "]");
  playerSum = sumHand(playerHand);
  return judgment();
};

// 9.Ask to repeat the game
function repeat() {
  var playMore = prompt("Do you want to play one more time?\n[1]Yes\n[2]No", "Type 1 or 2")
  if (playMore === "1") {
    return chooseGameType();
  } else {
    return alert("Thank you for playing, have a good day!");
  }
};

console.log(chooseGameType());