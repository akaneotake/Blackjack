var cardDeck = [];
var cardDeckObj = {};
var first2Cards = [];
var sum = 0;

console.log(gameType());

// 1.Choose the game type 
function gameType() {
  // Reset the card deck and sum
  cardDeck = [];
  cardDeck = generate52Cards();
  createCardDeckObj();
  sum = 0;
  
  alert("*** Black Jack ***\n*** Welcome! ***");
  var ask = prompt("How do you want to play today? Type one number:\n[1]Single Play (Get 21 Points)\n[2]Play against a dealer\n[3]Check the basic rule of Black Jack\n[4]Don't feel like to play", "1, 2, 3 or 4?");
  if (ask === "1") {
    return confirm(1);
  } else if (ask === "2") {
    return confirm(2);
  } else if (ask === "3") {
    alert("-Card numbers 2 to 9 will count as their corresponding card number.\n-Cards 10, Jack(11), Queen(12) and King(13) all count as 10 points.\n-The card Ace can count as either a 1 or 11.");
    return gameType();
  } else if (ask === "4") {
    return alert("Then, have a good day!");
  } else if (ask) {
    alert("Please choose ONE NUMBER from 1, 2 and 3!");
    return gameType();
  }
};

// 2.Confirm the game type
function confirm(num) {
  if(num === 1) {
    alert("You play a single game of Black Jack.\n \nIf you get over 21 points, the game is over.\nTry to get 21 or under!")
    return deal2Cards();
  } else if (num === 2) {
    alert("Let's play against a dealer!")
    return "準備中";
  }
};

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

// [Function] Make an object of the 52 cards (card: number value)
function createCardDeckObj() {
  var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  // Make property values (number)
  var numberValue = numbers.concat(numbers).concat(numbers.concat(numbers));
  // Connect keys and values
  for (var i = 0; i < cardDeck.length; i++) {
    var a = cardDeck[i];
    var b = numberValue[i];
    cardDeckObj[a] = b;
  }
  // Chanhe the values of aces
  cardDeckObj.C1 = [1, 11];
  cardDeckObj.S1 = [1, 11];
  cardDeckObj.D1 = [1, 11];
  cardDeckObj.H1 = [1, 11];
  return cardDeckObj;
}

// [Function] Delete the chosen card (argument = name of the card)
function removeCard(card) {
  var index = cardDeck.indexOf(card);
  if (index !== -1) {
    return cardDeck.slice(0, index).concat(cardDeck.slice(index + 1));
  }
  return cardDeck;
};

// 3.Deal the first 2 cards and delete them from the card deck
function deal2Cards() { 
  // First card
  var firstCard = cardDeck[Math.floor(Math.random() * cardDeck.length)];
  cardDeck = removeCard(firstCard);
  // Second card
  var secondCard = cardDeck[Math.floor(Math.random() * cardDeck.length)];
  cardDeck = removeCard(secondCard);
  
  first2Cards = [firstCard, secondCard];
  alert("...Now dealing...");
  alert("Open the cards!");  
  alert("The first 2 cards are: " + first2Cards);
  return separateAce();
}

// 4.Ace detector
function separateAce() {
  f = first2Cards[0];
  s = first2Cards[1];
  f1 = cardDeckObj[f][0] + cardDeckObj[s];
  f11 = cardDeckObj[f][1] + cardDeckObj[s];
  s1 = cardDeckObj[f] + cardDeckObj[s][0];
  s11 = cardDeckObj[f] + cardDeckObj[s][1];
  
  if ((f==="C1" || f==="S1" || f==="D1" || f==="H1") && (s==="C1" || s==="S1" || s==="D1" || s==="H1")) {
    return choose1or11("both");
    
  } else if (f==="C1" || f==="S1" || f==="D1" || f==="H1") {
    if (f11 === 21) {
      return addSum(21);
    } else if (f11 > 21) {
      alert("Your ace has to value '1', otherwise the sum will be over 21 points.");
      return addSum(f1);
    } else {
      return choose1or11("first");
    };
    
  } else if (s==="C1" || s==="S1" || s==="D1" || s==="H1") {
    if (s11 === 21) {
      return addSum(21);
    } else if (s11 > 21) {
      alert("Your ace has to value '1', otherwise the sum will be over 21 points.");
      return addSum(s1);
    } else {
      return choose1or11("second");
    };
  } else {
    firstCardsSum = cardDeckObj[f] + cardDeckObj[s];
    return addSum(firstCardsSum);
  }
};

// 4.5.Choose 1 or 11 if the card is ace
function choose1or11(which) {
  var explainAce = "Ace can be either 1 or 11. Which do you want to choose?";
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
  } else if (which === "both") {
    var chooseAce = prompt("Ace can be either 1 or 11. You have 2 aces. Please choose the combination of aces:\n[1]1 + 1 = 2\n[2]1 + 11 = 12", "Type 1 or 2");
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
  sum += sumNumber;
  alert("The sum of the cards is: " + sum);  
  // Case: Exactly 21 points
  if (sum === 21) {
    if (cardDeck.length === 50) {
      alert("Wow, you've got Black Jack!!!\nSo cool!!!");
      } else {  
        alert("Wow, you've got exactly 21 points! Nice!");
      };
      return repeat();
  // Case: either over 21 or under
  } else if (sum > 21) {
    alert("Booooooooom! You bust!");
    return repeat();
  } else {
    return standOrHit();
  };
};

// 6.Choose Stand or Hit
function standOrHit() {
  var ask = prompt("Do you want to stand, or hit? Type 1 or 2!\n(Your sum is now: " + sum + ")\n[1]Stand (stop to get a card and finish the game)\n[2]Hit (get more card and gain the points)", "Type 1 or 2");
  if (ask === "1") {
    alert("Your final points are: " + sum + "\n" + (21 - sum) + " more points for 21.");
    return repeat();
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
  alert("Your next card is: " + hitCard);

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