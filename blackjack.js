////// Global Variables
// For Player
var cardDeck = [];
var cardDeckObj = {};
var sum = 0;
// For Dealer
var cardDeck_D = [];
var first2Cards_D = [];
var sum_D = 0;
// For Games against Dealer
var checkGameType = 0;
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
  for (var i = 0; i < cardDeck.length; i++) {
    var a = cardDeck[i];
    var b = numberValue[i];
    cardDeckObj[a] = b;
  }
  // change the values of aces
  return cardDeckObj;
}

// [Function] Deal the first card
function dealFirstCard(array) {
  this.firstCard = array[Math.floor(Math.random() * array.length)];
  array = removeCard(array, this.firstCard);
  if (turn === "dealer") {
    detectAce(this.firstCard);
  }
  return array;
};
// [Function] Deal the second card
function dealSecondCard(array) {
  this.secondCard = array[Math.floor(Math.random() * array.length)];
  array = removeCard(array, this.secondCard);
  if (turn === "dealer") {
    detectAce(this.secondCard);
  }
  return array;
};

// [Function] Delete the dealt card (argument = name of the card)
function removeCard(array, card) {
  var index = array.indexOf(card);
  array = array.slice(0, index).concat(array.slice(index + 1));
  return array;
};

// [Function] Ace detector
function detectAce(card) {
  // decide the behavior of the ace
  if (card === "C1" || card === "S1" || card === "D1" || card === "H1") {
    if (turn === "player") {
      sum += cardDeckObj[card];
      if (sum < 21) {
        if (cardDeck.length === 51) {
          return sum;
        } else {
          return choose1or11();
        };
      } else if (sum > 21) {
        sum -= 10;
        return sum;
      };
    } else if (turn === "dealer") {
      sum_D += cardDeckObj[card];
      if (sum_D > 21) {
        sum_D -= 10;
      };
      return sum_D;
    };
  } else {
    if (turn === "player") {
      sum += cardDeckObj[card];
      return sum;
    } else if (turn === "dealer") {
      sum_D += cardDeckObj[card];
      return sum_D;
    };
  };
};

// [Function] Choose 1 or 11 if the card is an ace (for player)
function choose1or11() {
  var oneOrEleven = prompt("The Ace can be counted either 1 or 11. Which value do you want to use?\nEnter 1 or 11:");
  if (oneOrEleven === "1") {
    sum -= 10;
    return sum;
  } else if (oneOrEleven === "11") {
    return sum;
  } else if (oneOrEleven) {
    alert("Please type 1 or 11!");
    return choose1or11();
  };
};

////// Play against a dealer
// 2.1. Decide the bet
function playerBet(money) {
  // get the first $100
  wallet += Number(money);
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
  cardDeck_D = [];
  cardDeck_D = generate52Cards();
  sum_D = 0;
  turn = "dealer";
  // First card
  cardDeck_D = dealFirstCard(cardDeck_D);
  // Second card
  cardDeck_D = dealSecondCard(cardDeck_D);
  first2Cards_D = [this.firstCard, this.secondCard];
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
  if (cardDeck_D.length === 50) {
    alert("Now dealer's turn.\nDealer's first 2 cards were [" + first2Cards_D + "]");
  };
  alert("The sum of the dealer's cards = " + sum_D);
  // if the sum is exactly 21 points:
  if (sum_D === 21) {
    if (cardDeck_D.length === 50) {
      alert("Oh no, he got Black Jack!!!");
    } else {
      alert("Oh no, he got exactly 21 points!");
    };
    return playerVSdealer();
    // if the sum is over 21
  } else if (sum_D > 21) {
    alert("He busts! yeahhhhhhhhh!!!");
    return playerVSdealer();
    // dealer hit
  } else if (sum_D <= 16) {
    alert("He has to hit.");
    hitCard_D = cardDeck_D[Math.floor(Math.random() * cardDeck_D.length)];
    cardDeck_D = removeCard(cardDeck_D, hitCard_D);
    alert("His next card is [" + hitCard_D + "]");
    detectAce(hitCard_D);
    return dealer();
    // dealer stands  
  } else if (sum_D > 16) {
    alert("He has to stand.");
    return playerVSdealer();
  };
};

// 7.Compare the points (player and dealer)
function playerVSdealer() {
  alert("The final points:\nYou [" + sum + "] VS [" + sum_D + "] Dealer");
  if (sum > 21 && sum_D > 21) {
    alert("Both bust! The game was push (draw).");
    return betResult("push");
  } else if (sum <= 21 && sum_D > 21) {
    alert("You win because dealer busts!");
    return betResult("win");
  } else if (sum > sum_D) {
    alert("You win! Congratulations!!");
    return betResult("win");
  } else if (sum < sum_D) {
    alert("You lose.... Don't cry!");
    return betResult("lose");
  } else if (sum === sum_D) {
    if (cardDeck.length === 50) {
      if (cardDeck_D.length !== 50) {
        alert("You win with Black Jack! You are the best!!");
        return betResult("win");
      };
    } else {
      alert("Same points. The game was push (draw).");
      return betResult("push");
    };
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
  return repeat_D();

};

// 9.Ask to repeat the game with dealer
function repeat_D() {
  // if the wallet = 0:
  if (wallet == 0) {
    alert("You broke! No more money left to play....");
    return gameType();
  };
  var playMore = prompt("Do you want to keep betting? Type one number:\n[1]Yes, let's!\n[2]No, I want to finish this game and start new one.\n[3]Quit Blackjack.", "Type 1, 2 or 3")
  if (playMore === "1") {
    return playerBet(0);
  } else if (playMore === "2") {
    var response = prompt("The money in your wallet will NOT be saved. Are you sure to quit the game?\n[1]Yes\n[2]No", "Type 1 or 2");
    if (response === "1") {
      return gameType();
    } else {
      return repeat_D();
    };
  } else {
    var response = prompt("The money in your wallet will NOT be saved. Are you sure to quit Black Jack?\n[1]Yes\n[2]No", "Type 1 or 2");
    if (response === "1") {
      alert("Thank you for playing, have a good day!");
      return;
    } else {
      return repeat_D();
    };
  };
};

////// Single Play
// 1.Choose the game type 
function gameType() {
  // reset the game type
  checkGameType = 0;
  // create the 52 cards and number values
  cardDeck = [];
  cardDeck = generate52Cards();
  createCardDeckObj();
  // choose the game type
  alert("*** Black Jack ***\n*** Welcome! ***");
  var ask = prompt("How do you want to play today? Type one number:\n[1]Single Play (get 21 Points or less)\n[2]Play against a dealer\n[3]Check the basic rule of Blackjack\n[4]Don't feel like to play", "1, 2, 3 or 4?");
  if (ask === "1") {
    return confirm(1);
  } else if (ask === "2") {
    checkGameType = 1;
    return confirm(2);
  } else if (ask === "3") {
    alert("-The goal of the Blackjack game is to get your cards to tally up to 21 points.\n-Card numbers 2 to 9 will count as their corresponding card number.\n-10, Jack(11), Queen(12) and King(13) all count as 10 points.\n-Ace(1) can count as either 1 or 11.\n-At the start of the game, the player is dealt 2 cards.\n- The player then has the choice to either stand (stop receiving new cards) or hit (receive 1 new card or more).\n-A 10 (10, J, Q, K) card with an Ace card is called a Blackjack. Blackjack is higher than other combinations of 21 points (2, 9, 10 etc.)\n-Once the sum of the cards gets over 21 points, the player busts and the game will be over. ");
    return gameType();
  } else if (ask === "4") {
    return alert("Then, have a good day!");
  } else if (ask) {
    alert("Please choose ONE NUMBER from 1, 2, 3 and 4!");
    return gameType();
  }
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
    return playerBet("100");
  };
};

// 3.Deal the first 2 cards and delete them from the card deck
function deal2Cards() {
  // reset the card deck and sum
  cardDeck = [];
  cardDeck = generate52Cards();
  sum = 0;
  turn = "player";
  // First card
  cardDeck = dealFirstCard(cardDeck);
  // Second card
  cardDeck = dealSecondCard(cardDeck);
  alert("...Now dealing...");
  alert("Open the cards!");
  alert("The first 2 cards are [" + this.firstCard + " and " + this.secondCard + "]");
  detectAce(this.firstCard);
  detectAce(this.secondCard);
  return judgment();
}

// 4. Judge the sum
function judgment() {
  alert("The sum of the cards = " + sum);
  if (sum === 21) {
    if (cardDeck.length === 50) {
      alert("Wow, you've got Black Jack!!!\nSo cool!!!");
    } else {
      alert("Wow, you've got exactly 21 points! Nice!");
    };
    if (checkGameType === 1) {
      return dealer();
    } else {
      return repeat();
    };
  } else if (sum > 21) {
    alert("Booooooooom! You bust!");
    if (checkGameType === 1) {
      alert("You lose....");
      return betResult("lose");
    } else {
      return repeat();
    };
  } else if (sum < 21) {
    return standOrHit();
  };
};

// 5.Choose Stand or Hit
function standOrHit() {
  var ask = prompt("Do you want to stand, or hit? Type 1 or 2!\n(Your sum is now = " + sum + ")\n[1]Stand (stop to get a card)\n[2]Hit (get more card and gain the points)", "Type 1 or 2");
  // Stand
  if (ask === "1") {
    alert("Your final points = " + sum + "\n" + (21 - sum) + " more point(s) for 21.");
    // for play against dealer mode
    if (checkGameType === 1) {
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
  hitCard = cardDeck[Math.floor(Math.random() * cardDeck.length)];
  cardDeck = removeCard(cardDeck, hitCard);
  alert("Your next card is: [" + hitCard + "]");
  detectAce(hitCard);
  return judgment();
};

// 9.Ask to repeat the game
function repeat() {
  var playMore = prompt("Do you want to play one more time?\n[1]Yes\n[2]No", "Type 1 or 2")
  if (playMore === "1") {
    return gameType();
  } else {
    return alert("Thank you for playing, have a good day!");
  }
};

console.log(gameType());