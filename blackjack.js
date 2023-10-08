////// Global Variables
// For Player
var cardDeck = [];
var cardDeckObj = {};
var first2Cards = [];
var sum = 0;
// For Dealer
var cardDeck_D = [];
var first2Cards_D = [];
var sum_D = 0;
// For Games against Dealer
var checkGameType = 0;
var bet = 0;
var wallet = 0;

////// Functions
// [Function] Make an array of card deck with 52 cards
function generate52Cards() {
  var suits = ["C", "S", "D", "H"];
  var ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < ranks.length; j++) {
      cardDeck.push(suits[i] + ranks[j]);
    };
  };
  return cardDeck;
};

// [Function] Make an object of the 52 cards (property = card: number value)
function createCardDeckObj() {
  var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  // make property values (number)
  var numberValue = numbers.concat(numbers).concat(numbers.concat(numbers));
  // connect keys and values
  for (var i = 0; i < cardDeck.length; i++) {
    var a = cardDeck[i];
    var b = numberValue[i];
    cardDeckObj[a] = b;
  }
  // change the values of aces
  cardDeckObj.C1 = [1, 11];
  cardDeckObj.S1 = [1, 11];
  cardDeckObj.D1 = [1, 11];
  cardDeckObj.H1 = [1, 11];
  return cardDeckObj;
}

// [Function] Delete the dealt card (argument = name of the card)
function removeCard(card) {
  var index = cardDeck.indexOf(card);
  if (index !== -1) {
    return cardDeck.slice(0, index).concat(cardDeck.slice(index + 1));
  }
  return cardDeck;
};

////// Play against a dealer
// 3. Decide the bet
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

// 4. Dealer: Deal the first 2 cards and delete them from the card deck (show one card to the player)
function deal2Cards_D() { 
  // reset the card deck and sum for dealer
  cardDeck_D = [];
  cardDeck_D = generate52Cards();
  sum_D = 0;
  // First card
  var firstCard = cardDeck[Math.floor(Math.random() * cardDeck.length)];
  cardDeck_D = removeCard(firstCard);
  // Second card
  var secondCard = cardDeck[Math.floor(Math.random() * cardDeck.length)];
  cardDeck_D = removeCard(secondCard);
  // set the first 2 cards in the array
  first2Cards_D = [firstCard, secondCard];
  // show one of the dealer's card to player 
  alert("First, the dealer gets 2 cards.");
  alert("One of the dealer's card is [" + first2Cards_D[0]+ "]");
  alert("Now, you get the first 2 cards.");
  // Player's turn (use the same functions as single play)
  return deal2Cards();
};

// 6. Dealer: get next cards
function dealer() {
  alert("Now dealer's turn.\nDealer's first 2 cards were [" + first2Cards_D + "]");
  return separateAce_D(first2Cards_D);
};

// 6.5.Dealer: Ace detector (Choose 1 or 11 if the card is ace)
function separateAce_D(array) {  
  var f_D = array[0];
  var s_D = array[1];
  var f1_D = cardDeckObj[f_D][0] + cardDeckObj[s_D];
  var f11_D = cardDeckObj[f_D][1] + cardDeckObj[s_D];
  var s1_D = cardDeckObj[f_D] + cardDeckObj[s_D][0];
  var s11_D = cardDeckObj[f_D] + cardDeckObj[s_D][1];
  // if the both of first 2 cards are aces:
  if ((f_D==="C1" || f_D==="S1" || f_D==="D1" || f_D==="H1") && (s_D==="C1" || s_D==="S1" || s_D==="D1" || s_D==="H1")) {
    return addSum_D(12); 
  // if the first card is ace:
  } else if (f_D==="C1" || f_D==="S1" || f_D==="D1" || f_D==="H1") {
    if (f11_D === 21) {
      return addSum_D(21);
    } else if (f11_D > 21) {
      return addSum_D(f1_D);
    } else {
      return addSum_D(f11_D);
    };     
  // if the second card is ace:
  } else if (s_D==="C1" || s_D==="S1" || s_D==="D1" || s_D==="H1") {
    if (s11_D === 21) {
      return addSum_D(21);
    } else if (s11_D > 21) {
      return addSum_D(s1_D);
    } else {
      return addSum_D(s11_D);
    };
  // if there is no ace in the first 2 cards:
  } else {
    return addSum_D(cardDeckObj[f_D] + cardDeckObj[s_D]);
  };
};

// 7.Dealer: Make the sum of the cards 
function addSum_D(sumNumber) {
  // gather points
  sum_D += sumNumber;
  alert("Dealer has " + sum_D + " points.");  
  // if the sum is exactly 21 points:
  if (sum_D === 21) {
    if (cardDeck_D.length === "50") {
      alert("Oh no, he got Black Jack!!!");
    } else {  
       alert("Oh no, he got exactly 21 points!");
    };
    return playerVSdealer();
  // if the sum is either over 21 or under:
  } else if (sum_D > 21) {
    alert("He busts! yeahhhhhhhhh!!!");
    return playerVSdealer();
  } else {
    return standOrHit_D();
  };
};

// 8.Dealer: Choose Stand or Hit
function standOrHit_D() {
  // dealer hits
  if (sum_D <= 16) {
    alert("He has to hit.");
    var hitCard = cardDeck_D[Math.floor(Math.random() * cardDeck.length)];
    cardDeck_D = removeCard(hitCard);
    alert("His next card is [" + hitCard + "]");
    // if the card is an ace:
    if (hitCard==="C1" || hitCard==="S1" || hitCard==="D1" || hitCard==="H1") {
      if (sum_D + 11 > 21) {
        return addSum_D(1);
      } else {
        return addSum_D(11);
      };
    // if the card isn't an ace:  
    } else {
      return addSum_D(cardDeckObj[hitCard]);
    };
  // dealer stands  
  } else if (sum_D > 16) {
    alert("He has to stand.");
    return  playerVSdealer();
  };
};

// 9.Compare the points (player and dealer)
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

// 10.Return the bet
function betResult(result) {
  if (result === "win") {
    alert("Your bet $" + bet + " is now doubled $" + (bet*2) + "! Hooray!!")
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

// 11.Ask to repeat the game with dealer
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
      return ;
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
  if(num === 1) {
    alert("You play a single game of Blackjack.\n \nIf you get over 21 points, the game is over.\nTry to get 21 or under!")
    return deal2Cards();
  } else if (num === 2) {
    // reset bet and wallet
    bet = 0;
    wallet = 0;
    alert("Let's play against a dealer!")
    return playerBet("100");
  }
};

// 3.Deal the first 2 cards and delete them from the card deck
function deal2Cards() { 
  // reset the card deck and sum
  cardDeck = [];
  cardDeck = generate52Cards();
  sum = 0;
  // First card
  var firstCard = cardDeck[Math.floor(Math.random() * cardDeck.length)];
  cardDeck = removeCard(firstCard);
  // Second card
  var secondCard = cardDeck[Math.floor(Math.random() * cardDeck.length)];
  cardDeck = removeCard(secondCard);
  // set the first 2 cards in the array
  first2Cards = [firstCard, secondCard];
  alert("...Now dealing...");
  alert("Open the cards!");  
  alert("The first 2 cards are [" + first2Cards + "]");
  return separateAce(first2Cards);
}

// 4.Ace detector
function separateAce() {
  f = first2Cards[0];
  s = first2Cards[1];
  f1 = cardDeckObj[f][0] + cardDeckObj[s];
  f11 = cardDeckObj[f][1] + cardDeckObj[s];
  s1 = cardDeckObj[f] + cardDeckObj[s][0];
  s11 = cardDeckObj[f] + cardDeckObj[s][1];
  // if the both cards are aces:
  if ((f==="C1" || f==="S1" || f==="D1" || f==="H1") && (s==="C1" || s==="S1" || s==="D1" || s==="H1")) {
    return choose1or11("both");
  // if the first card is an ace:
  } else if (f==="C1" || f==="S1" || f==="D1" || f==="H1") {
    if (f11 === 21) {
      return addSum(21);
    } else if (f11 > 21) {
      alert("Your ace has to value '1', otherwise the sum will be over 21 points.");
      return addSum(f1);
    } else {
      return choose1or11("first");
    };
  // if the second card is an ace:
  } else if (s==="C1" || s==="S1" || s==="D1" || s==="H1") {
    if (s11 === 21) {
      return addSum(21);
    } else if (s11 > 21) {
      alert("Your ace has to value '1', otherwise the sum will be over 21 points.");
      return addSum(s1);
    } else {
      return choose1or11("second");
    };
  // if there are no ace in the first 2 cards:
  } else {
    firstCardsSum = cardDeckObj[f] + cardDeckObj[s];
    return addSum(firstCardsSum);
  }
};

// 4.5.Choose 1 or 11 if the card is an ace
function choose1or11(which) {
  var explainAce = "Ace can be counted either 1 or 11. Which value do you want to use?";
  // if the first card is an ace:
  if (which === "first") {
    var chooseAce = prompt(explainAce + "\n The other card is: " + cardDeckObj[s], "Type 1 or 11");
    if (chooseAce === "1") {
      return addSum(f1);
    } else if (chooseAce === "11") {
      return addSum(f11);
    } else if (chooseAce) {
      alert("Please type 1 or 11!");
      return choose1or11("first");
    };      
  // if the second card is an ace:
  } else if (which === "second") {
    var chooseAce = prompt(explainAce + "\n The other card is: " + cardDeckObj[f], "Type 1 or 11");
    if (chooseAce === "1") {
      return addSum(s1);
    } else if (chooseAce === "11") {
       return addSum(s11);
    } else if (chooseAce) {
      alert("Please type 1 or 11!");
      return choose1or11("second");
    };
  // if the card which player hits is an ace:
  } else if (which === "third") {
      var chooseAce = prompt(explainAce, "Type 1 or 11");
    if (chooseAce === "1") {
      return addSum(1);
    } else if (chooseAce === "11") {
      return addSum(11);
    } else if (chooseAce) {
      alert("Please type 1 or 11!");
      return choose1or11("third");
    };
  // if the both of the first 2 cards are aces:
  } else if (which === "both") {
    var chooseAce = prompt("Ace can be counted either 1 or 11. You have 2 aces. Please choose the combination of aces:\n[1]1 + 1 = 2\n[2]1 + 11 = 12", "Type 1 or 2");
    if (chooseAce === "1") {
      return addSum(2);
    } else if (chooseAce === "2") {
      return addSum(12);
    } else if (chooseAce) {
      alert("Please type 1 or 11!");
      return choose1or11("both");
    }
  };
};

// 5. Make the sum of the cards (finish the game if Black Jack / 21 points)
function addSum(sumNumber) {
  // gather points
  sum += sumNumber;
  alert("The sum of the cards = " + sum);  
  // if the sum is exactly 21 points:
  if (sum === 21) {
    if (cardDeck.length === "50") {
      alert("Wow, you've got Black Jack!!!\nSo cool!!!");
    } else {  
       alert("Wow, you've got exactly 21 points! Nice!");
    };
    // for play against dealer mode
    if (checkGameType === 1) {
      return dealer();
    } else {
      return repeat();
    };
  // if the sum is over 21:
  } else if (sum > 21) {
    alert("Booooooooom! You bust!");
    if (checkGameType === 1) {
      alert("You lose....");
      return betResult("lose");
    } else {
      return repeat();
    };
  // if the sum is under 21:
  } else {
    return standOrHit();
  };
};

// 6.Choose Stand or Hit
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
    return  hit();
  } else {
    alert("Please type 1 or 2!")
    return standOrHit();
  };
};

// 6.5.Hit
function hit() {
  var hitCard = cardDeck[Math.floor(Math.random() * cardDeck.length)];
  cardDeck = removeCard(hitCard);
  alert("Your next card is: [" + hitCard + "]");
  // if the card is an ace:
  if (hitCard==="C1" || hitCard==="S1" || hitCard==="D1" || hitCard==="H1") {
    if (sum + 11 > 21) {
      alert("Your ace has to value '1', otherwise the sum will be over 21 points.");
      return addSum(1);
    } else {
      return choose1or11("third");
    };
  } else {
    return addSum(cardDeckObj[hitCard]);
  };
};

// 7.Ask to repeat the game
function repeat() {
  var playMore = prompt("Do you want to play one more time?\n[1]Yes\n[2]No", "Type 1 or 2")
  if (playMore === "1") {
    return gameType();
  } else {
    return alert("Thank you for playing, have a good day!");
  }
};

console.log(gameType());