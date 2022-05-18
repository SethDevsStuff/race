var socket = new io();
var game = {
  players: [
    {
      location: 38,
      color: "Plum",
    },
    {
      location: 38,
      color: "lime",
    },
    {},
    {},
  ],
};
var selfIndex = 0;
var cardImg = image("./rtqcCard.png");
var difCardImg = image("./rtqcHardCard.png");
var boardImg = image("./rtqcBoard.png");
var allSquares = new Group(0, 0, 1, "gameBoard");
var tileColorNames = ["red", "orange", "yellow", "green", "blue", "purple"];
var tileColors = [
  "#ff0000ff",
  "#ff9900ff",
  "#ffff00ff",
  "#50f850ff",
  "#0000ffff",
  "#ec00ffff",
];
var playerColors = [
  "Aquamarine",
  "DeepPink",
  "Tomato",
  "Gold",
  "Plum",
  "Indigo",
  "LimeGreen",
  "Teal",
  "SlateGray",
];
var allTiles = [
  new Square(180, 520, "red"),
  new Square(200, 425, "orange"),
  new Square(218, 330, "yellow"),
  new Square(255, 250, "green"),
  new Square(335, 215, "blue"),
  new Square(420, 190, "purple"),
  new Square(520, 190, "red"),
  new Square(590, 230, "orange"),
  new Square(575, 315, "yellow"),
  new Square(565, 393, "green"),
  new Square(555, 478, "blue"),
  new Square(575, 560, "purple"),
  new Square(660, 585, "red"),
  new Square(743, 605, "orange"),
  new Square(825, 620, "yellow"),
  new Square(910, 630, "green"),
  new Square(990, 620, "blue"),
  new Square(1074, 593, "purple"),
  new Square(1125, 510, "red"),
  new Square(1155, 425, "orange"),
  new Square(1185, 355, "yellow"),
  new Square(1210, 280, "green"),
  new Square(1240, 210, "blue"),
  new Square(1285, 155, "purple"),
  new Square(1373, 145, "red"),
  new Square(1450, 180, "orange"),
  new Square(1470, 265, "yellow"),
  new Square(1480, 330, "green"),
  new Square(1478, 405, "blue"),
  new Square(1480, 485, "purple"),
  new Square(1488, 563, "red"),
  new Square(1520, 640, "orange"),
  new Square(1590, 690, "yellow"),
  new Square(1665, 700, "green"),
  new Square(1740, 675, "blue"),
  new Square(1775, 590, "purple"),
  new Square(1785, 510, "red"),
  new Square(1800, 430, "orange"),
  new Square(80, 500, "red"),
];
var testQuestion = {
  prompt: "what is 1+1",
  number: 1,
  choices: [
    { displayText: "2", optionNumber: 0 },
    { displayText: "1", optionNumber: 1 },
    { displayText: "0", optionNumber: 2 },
    { displayText: "undefined", optionNumber: 3 },
  ],
};

var mainMenu = new Group(0, 0, 1);
var playButton = new Component(300, 250, 200, 100, {
  color: "#2d8723",
  clickable: true,
  outline: true,
  outlineProperties: { width: 7, color: "#255220" },
});
var playButtonText = new Component(400, 310, 0, 0, {
  type: "text",
  font: "consolas",
  fontSize: 45,
  text: "Play",
  color: "#255220",
});
playButton.addToGroup("mainMenu");
playButtonText.addToGroup("mainMenu");
playButton.tempOnHover = {
  color: "#52a857",
};
playButton.onclick = () => {
  mainMenu.hide();
  mainPlayMenu.show();
};
var aboutButton = new Component(300, 375, 200, 50, {
  clickable: true,
  color: "#fff536",
  outline: true,
  outlineProperties: { width: 5, color: "#ffdd36" },
});
var aboutButtonText = new Component(400, 410, 0, 0, {
  type: "text",
  font: "consolas",
  fontSize: 30,
  text: "About Us",
  color: "#ffdd36",
});
aboutButton.addToGroup("mainMenu");
aboutButtonText.addToGroup("mainMenu");
aboutButton.tempOnHover = {
  color: "#fffa75",
};
aboutButton.onclick = () => {
  //mainMenu.hide();
};

var mainPlayMenu = new Group(0, 0, 1);
var createGameButton = new Component(225, 150, 150, 75, {
  clickable: true,
  color: "#15b361",
  outline: true,
  outlineProperties: { width: 7, color: "#195c39" },
});
var createGameButtonText = new Component(300, 182, 0, 0, {
  type: "text",
  color: "#195c39",
  font: "consolas",
  fontSize: 30,
  text: ["Create", "Game"],
});
var joinGameButton = new Component(425, 150, 150, 75, {
  clickable: true,
  color: "#b62ff5",
  outline: true,
  outlineProperties: { width: 8, color: "#72179c" },
});
var joinGameButtonText = new Component(500, 182, 0, 0, {
  type: "text",
  color: "#72179c",
  font: "consolas",
  fontSize: 30,
  text: ["Join", "Game"],
});
createGameButton.addToGroup("mainPlayMenu");
createGameButtonText.addToGroup("mainPlayMenu");
joinGameButton.addToGroup("mainPlayMenu");
joinGameButtonText.addToGroup("mainPlayMenu");
createGameButton.tempOnHover = {
  color: "#18c454",
};
joinGameButton.tempOnHover = {
  color: "#c352f7",
};
joinGameButton.onclick = () => {
  var code = prompt("Input Game Code");
  socket.emit("joinRtqcGame", code);
  console.log("Requested to join game " + code);
};
createGameButton.onclick = () => {
  var name = prompt("Please enter a name for your game room");
  socket.emit("createRtqcRoom", name);
  console.log("Requested to make room:\n" + name);
};

var createGameText = new Component(300, 250, 0, 0, {
  type: "text",
  font: "consolas",
  fontSize: 13,
  text: ["Create and host", "your own game", "for others to", "join and play"],
});
var joinGameText = new Component(500, 250, 0, 0, {
  type: "text",
  font: "consolas",
  fontSize: 13,
  text: ["Join an already", "created game using", "a game code"],
});
createGameText.addToGroup("mainPlayMenu");
joinGameText.addToGroup("mainPlayMenu");

var backInPlayButton = new Component(362.5, 450, 75, 30, {
  color: "#cccccc",
  clickable: true,
  outline: true,
  outlineProperties: { width: 4, color: "#919191" },
});
var backInPlayButtonText = new Component(400, 470, 0, 0, {
  type: "text",
  font: "consolas",
  fontSize: 20,
  text: "Back",
});

backInPlayButton.addToGroup("mainPlayMenu");
backInPlayButtonText.addToGroup("mainPlayMenu");

backInPlayButton.tempOnHover = {
  color: "#d6d6d4",
};
backInPlayButton.onclick = () => {
  mainPlayMenu.hide();
  mainMenu.show();
};

mainPlayMenu.hide();

var waitingRoom = new Group(0, 0, 1);
waitingRoom.hide();
var waitingRoomName = new Component(400, 100, 0, 0, {
  type: "text",
  text: "Room name here",
  font: "consolas",
  fontSize: 40,
});
waitingRoomName.addToGroup("waitingRoom");
var row = 0;
var colorPickerGrid = [];
for (let i = 0; i < 9; i++) {
  if (isDivisibleBy(i, 3) && i != 0) row += 1;
  colorPickerGrid[i] = new Component(
    50 + 100 * (i - row * 3),
    200 + row * 100,
    75,
    75,
    { clickable: true, color: playerColors[i] }
  );
  colorPickerGrid[i].addToGroup("waitingRoom");
  colorPickerGrid[i].onclick = () => {
    console.log("You selected " + playerColors[i]);
    socket.emit("selectRtqcColor", playerColors[i]);
  };
}

var winnerMenu = new Group(0, 0, 1);
winnerMenu.hide();
var winnerLeadup = new Component(400, 100, 0, 0, {
  type: "text",
  text: ["Congratulations!", "The Winner Is:"],
  font: "consolas",
  fontSize: 25,
});
winnerLeadup.addToGroup("winnerMenu");
var winnerName = new Component(400, 175, 0, 0, {
  type: "text",
  text: "Winner Name",
  color: "black",
  font: "consolas",
  fontSize: 35,
});
winnerName.addToGroup("winnerMenu");

//Scale for pieces = 0.5;
//x y for regular cards = [-241, -698]
//x y for difficult cards = [-582, -698]
var gameBoard = new Group(0, 0, 1);
gameBoard.hide();
[gameBoard.scaleX, gameBoard.scaleY] = Array(2).fill(0.5);
var gameBoardImg = new Component(0, 0, 3840, 2160, {
  type: "image",
  imageProperties: { src: boardImg },
});
gameBoardImg.addToGroup("gameBoard");
var allPlayers = new Group(0, 0, 1, "gameBoard");
var allPlayersArr = [
  new playerSquare(38, "green"),
  new playerSquare(38, "lime"),
  new playerSquare(38, "coral"),
  new playerSquare(38, "salmon"),
];

var allCards = new Group(0, 0, 1);
var regCards = new Group(0, 0, 1, "allCards");
regCards.hide();
var leftRegCards = new Group(0, 0, 1, "regCards");
leftRegCards.addAnimation("closeShuffle", 800, { x: 0 }, () => {
  topRegCard.show();
  cardHider.hide();
  regCards.hide();
});
leftRegCards.addAnimation("shuffle", 800, { x: -115 }, () => {
  leftRegCards.setPoints();
  topRegCard.hide();
});
var cardHider = new Component(298, 98, 204, 118, { color: "#b5c055ff" });
cardHider.addToGroup("allCards");
cardHider.hide();
var botRegCard = new Component(300, 100, 200, 114, {
  type: "image",
  imageProperties: { src: cardImg },
});
botRegCard.addToGroup("leftRegCards");
var midRegCard = new Component(300, 100, 200, 114, {
  type: "image",
  imageProperties: { src: cardImg },
});
midRegCard.addToGroup("regCards");
var topRegCard = new Component(300, 100, 200, 114, {
  type: "image",
  imageProperties: { src: cardImg },
});
topRegCard.addToGroup("leftRegCards");

midRegCard.addAnimation("closeShuffle", 800, { x: 300 });
midRegCard.addAnimation("shuffle", 800, { x: 415 }, () => {
  midRegCard.setPoints();
  setTimeout(() => {
    leftRegCards.closeShuffle();
    midRegCard.closeShuffle();
  }, 100);
});
topRegCard.addAnimation("swipeSelf", 300, { y: 600 }, () => {
  topRegCard.y = 100;
  problemMenu.y = 350;
  problemMenu.show();
  regCards.hide();
  setTimeout(() => {
    problemMenu.slide();
  }, 200);
});
topRegCard.addAnimation("selfDraw", 300, { y: 110 }, () => {
  topRegCard.swipeSelf();
});

function regCardsShuffle() {
  panTo(641, 998, () => {
    cardHider.show();
    regCards.show();
    leftRegCards.shuffle();
    midRegCard.shuffle();
  });
}
function regSelfDraw(question) {
  panTo(641, 998, () => {
    regCards.show();
    displayNewQuestion(question);
    topRegCard.selfDraw();
  });
}

var difCards = new Group(0, 0, 1, "allCards");
difCards.hide();
var leftDifCards = new Group(0, 0, 1, "difCards");

var botDifCard = new Component(300, 100, 200, 114, {
  type: "image",
  imageProperties: { src: difCardImg },
});
botDifCard.addToGroup("leftDifCards");
var midDifCard = new Component(300, 100, 200, 114, {
  type: "image",
  imageProperties: { src: difCardImg },
});
midDifCard.addToGroup("difCards");
var topDifCard = new Component(300, 100, 200, 114, {
  type: "image",
  imageProperties: { src: difCardImg },
});
topDifCard.addToGroup("leftDifCards");

topDifCard.addAnimation("swipeSelf", 300, { y: 600 }, () => {
  topDifCard.y = 100;
  difCards.hide();
  problemMenu.y = 350;
  problemMenu.show();
  setTimeout(() => {
    problemMenu.slide();
  }, 200);
});
topDifCard.addAnimation("selfDraw", 300, { y: 110 }, () => {
  topDifCard.swipeSelf();
});

leftDifCards.addAnimation("closeShuffle", 800, { x: 0 }, () => {
  cardHider.hide();
  difCards.hide();
  topDifCard.show();
});
leftDifCards.addAnimation("shuffle", 800, { x: -115 });

midDifCard.addAnimation("closeShuffle", 800, { x: 300 });
midDifCard.addAnimation("shuffle", 800, { x: 415 }, () => {
  setTimeout(() => {
    topDifCard.hide();
    midDifCard.closeShuffle();
    leftDifCards.closeShuffle();
  }, 100);
});

function difCardsShuffle() {
  panTo(982, 998, () => {
    difCards.show();
    cardHider.show();
    leftDifCards.shuffle();
    midDifCard.shuffle();
  });
}
function difSelfDraw(question) {
  panTo(982, 998, () => {
    difCards.show();
    displayNewQuestion(question);
    topDifCard.selfDraw();
  });
}

var problemMenu = new Group(0, 0, 1);
problemMenu.addAnimation("slide", 300, { y: 0 });
problemMenu.addAnimation("slideAway", 300, { y: 350 }, () => {
  problemMenu.hide();
  problemMenu.y = 0;
});
var choiceBoxes = new Group(0, 0, 1, "problemMenu");
var questionBox = new Component(150, 250, 500, 150, {
  color: "#f5f5dc",
  outline: true,
  outlineProperties: { color: "#e3e3c1", width: 4 },
});
var questionBoxText = new Component(400, 310, 0, 0, {
  type: "text",
  color: "#c7c7a3",
  font: "consolas",
  fontSize: 25,
  text: "___________________",
});
var questionID = new Component(175, 275, 0, 0, {
  type: "text",
  color: "#c7c7a3",
  font: "consolas",
  fontSize: 15,
  text: "#?",
  fontModifiers: "italic",
});

var choiceOne = new Component(50, 430, 145, 125, {
  clickable: true,
  color: "#ffe4e1",
  outline: true,
  outlineProperties: { color: "#fccac5", width: 5 },
});
var choiceOneText = new Component(122.5, 480, 0, 0, {
  type: "text",
  color: "#fcb5ae",
  font: "consolas",
  fontSize: 20,
  fontModifiers: "italic",
  text: ["Option", "One"],
});
var idA = new Component(70, 450, 0, 0, {
  type: "text",
  color: "#fccac5",
  font: "consolas",
  fontSize: 15,
  text: "a.",
  fontModifiers: "bold italic",
});
var choiceTwo = new Component(235, 430, 145, 125, {
  clickable: true,
  color: "#f0f8ff",
  outline: true,
  outlineProperties: { color: "#d7ebfc", width: 5 },
});
var choiceTwoText = new Component(307.5, 480, 0, 0, {
  type: "text",
  color: "#c3dff7",
  font: "consolas",
  fontSize: 20,
  fontModifiers: "italic",
  text: ["Option", "Two"],
});
var idB = new Component(255, 450, 0, 0, {
  type: "text",
  color: "#d7ebfc",
  font: "consolas",
  fontSize: 15,
  text: "b.",
  fontModifiers: "bold italic",
});
var choiceThree = new Component(420, 430, 145, 125, {
  clickable: true,
  color: "#fffff0",
  outline: true,
  outlineProperties: { color: "#f7f7be", width: 5 },
});
var choiceThreeText = new Component(492.5, 480, 0, 0, {
  type: "text",
  color: "#f0f0a5",
  font: "consolas",
  fontSize: 20,
  fontModifiers: "italic",
  text: ["Option", "Three"],
});
var idC = new Component(440, 450, 0, 0, {
  type: "text",
  color: "#f7f7be",
  font: "consolas",
  fontSize: 15,
  text: "c.",
  fontModifiers: "bold italic",
});
var choiceFour = new Component(605, 430, 145, 125, {
  clickable: true,
  color: "#f5fffa",
  outline: true,
  outlineProperties: { color: "#cafce3", width: 5 },
});
var choiceFourText = new Component(677.5, 480, 0, 0, {
  type: "text",
  color: "#a9f5cf",
  font: "consolas",
  fontSize: 20,
  fontModifiers: "italic",
  text: ["Option", "Four"],
});
var idD = new Component(625, 450, 0, 0, {
  type: "text",
  color: "#cafce3",
  font: "consolas",
  fontSize: 15,
  text: "d.",
  fontModifiers: "bold italic",
});

choiceOne.onclick = () => {
  emitQuestion(0);
};
choiceTwo.onclick = () => {
  emitQuestion(1);
};
choiceThree.onclick = () => {
  emitQuestion(2);
};
choiceFour.onclick = () => {
  emitQuestion(3);
};

function emitQuestion(num) {
  var answer = choiceDisplayOrder[num].optionNumber;
  console.log("You chose answer:\n", answer);
  socket.emit("rtqcAnswer", answer);
}

choiceOne.addToGroup("choiceBoxes");
choiceTwo.addToGroup("choiceBoxes");
choiceThree.addToGroup("choiceBoxes");
choiceFour.addToGroup("choiceBoxes");
choiceOneText.addToGroup("choiceBoxes");
choiceTwoText.addToGroup("choiceBoxes");
choiceThreeText.addToGroup("choiceBoxes");
choiceFourText.addToGroup("choiceBoxes");
idA.addToGroup("choiceBoxes");
idB.addToGroup("choiceBoxes");
idC.addToGroup("choiceBoxes");
idD.addToGroup("choiceBoxes");
questionBox.addToGroup("problemMenu");
questionBoxText.addToGroup("problemMenu");
questionID.addToGroup("problemMenu");

problemMenu.hide();

var showColor = new Component(350, -100, 100, 100, {});
showColor.addAnimation("hideColor", 300, { y: -100 });
showColor.hide();
showColor.addAnimation("showColor", 300, { y: 200 }, () => {
  setTimeout(() => {
    showColor.hideColor(() => {
      var nextSquare = allTiles.findIndex((s, index) => {
        var currentLocation = allPlayersArr[selfIndex].location;
        if (currentLocation == 38) currentLocation = -1;
        return (
          s.color ==
            tileColorNames[tileColors.indexOf(showColor.options.color)] &&
          index > currentLocation
        );
      });
      allPlayersArr[selfIndex].moveTo(nextSquare);
    });
  }, 500);
});
var incorrectDisplay = new Group(0, -410, 1);
incorrectDisplay.addAnimation("slideUp", 200, { y: -410 });
incorrectDisplay.addAnimation("slideDown", 300, { y: 0 }, () => {
  setTimeout(() => {
    incorrectDisplay.slideUp();
  }, 800);
});
var incorrectBackground = new Component(250, 200, 300, 200, {
  color: "#fac0c0",
  outline: true,
  outlineProperties: { width: 5, color: "#f75e5e" },
});
incorrectBackground.addToGroup("incorrectDisplay");
var incorrectText = new Component(400, 310, 0, 0, {
  type: "text",
  color: "#f75e5e",
  text: "incorrect",
  fontSize: 50,
  font: "consolas",
});
incorrectText.addToGroup("incorrectDisplay");

function displayNewQuestion(question) {
  /*
	question = {
		number,
		prompt,
		choices:[4*{
			displayText,
			optionNumber
		}],
		constantOrder
	}
	*/
  question = JSON.parse(JSON.stringify(question));
  questionBoxText.options.text = question.prompt;
  questionID.options.text = "#" + (question.number + 1);
  choiceDisplayOrder = [];
  if (!question.constantOrder) {
    while (question.choices.length > 0) {
      var random = Math.floor(Math.random() * question.choices.length);
      choiceDisplayOrder.push(question.choices[random]);
      question.choices.splice(random, 1);
    }
  } else {
    choiceDisplayOrder = [
      question.choices[0],
      question.choices[1],
      question.choices[2],
      question.choices[3],
    ];
  }
  choiceOneText.options.text = choiceDisplayOrder[0].displayText;
  choiceTwoText.options.text = choiceDisplayOrder[1].displayText;
  choiceThreeText.options.text = choiceDisplayOrder[2].displayText;
  choiceFourText.options.text = choiceDisplayOrder[3].displayText;
}

var screenCloserTop = new Component(0, -310, 800, 300, {
  color: "silver",
  outline: true,
  outlineProperties: { width: 8, color: "DimGray" },
});
var screenCloserBot = new Component(0, 610, 800, 300, {
  color: "silver",
  outline: true,
  outlineProperties: { width: 8, color: "DimGray" },
});
screenCloserTop.addAnimation("startOpen", 300, { y: -310 });
screenCloserTop.addAnimation("startClose", 300, { y: 0 });
screenCloserBot.addAnimation("startOpen", 300, { y: 610 });
screenCloserBot.addAnimation("startClose", 300, { y: 300 }, () => {
  waitingRoom.hide();
  gameBoard.show();
  setTimeout(() => {
    screenCloserTop.startOpen();
    screenCloserBot.startOpen();
  }, 1000);
});

screenCloserTop.addAnimation("endOpen", 300, { y: -310 });
screenCloserTop.addAnimation("endClose", 300, { y: 0 });
screenCloserBot.addAnimation("endOpen", 300, { y: 610 });
screenCloserBot.addAnimation("endClose", 300, { y: 300 }, () => {
  gameBoard.hide();
  winnerMenu.show();
  setTimeout(() => {
    screenCloserTop.endOpen();
    screenCloserBot.endOpen();
  }, 1000);
});

function Square(x, y, color, trap) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.trap = trap;
  this.spot = new Component(x, y, 5, 5, {});
  this.spot.hide();
  this.spot.addToGroup("allSquares");
}
function panTo(x, y, runAfter) {
  var panDistance = distance([x, y], [gameBoard.x, gameBoard.y]);
  gameBoard.addAnimation("pan", (panDistance + 1) * 0.6, {
    x: -x + 400,
    y: -y + 300,
  });
  gameBoard.pan(runAfter);
}
function panToSquare(square, runAfter) {
  panTo(allTiles[square].x, allTiles[square].y, runAfter);
}
function playerSquare(location, color) {
  this.location = location;
  this.color = color;

  this.component = new Component(
    allTiles[location].x,
    allTiles[location].y,
    90,
    90,
    { color }
  );
  this.component.addToGroup("allPlayers");
  this.moveTo = function (square) {
    panToSquare(this.location, () => {
      setTimeout(() => {
        var movementDistance = distance(
          [allTiles[this.location].x, allTiles[this.location].y],
          [gameBoard.x, gameBoard.y]
        );
        this.component.addAnimation("move", (movementDistance + 1) * 0.6, {
          x: allTiles[square].x,
          y: allTiles[square].y,
        });
        this.component.move();
        this.location = square;
        panToSquare(this.location);
      }, 300);
    });
  };
}
function displayResult(result) {
  if (result[0]) {
    showColor.options.color = tileColors[tileColorNames.indexOf(result[1])];
    showColor.show();
    showColor.showColor();
  } else {
    incorrectDisplay.slideDown();
  }
}
function isDivisibleBy(dividend, divisor) {
  var quotient = dividend / divisor;
  if (Math.floor(quotient) == quotient) return true;
  return false;
}
function startGame() {
  screenCloserTop.startClose();
  screenCloserBot.startClose();
}
function endGame(index) {
  winnerName.options.color = game.players[index].color;
  winnerName.options.text = game.players[index].color;
  screenCloserTop.endClose();
  screenCloserBot.endClose();
}

//msg = [msgName, gameData, specificData]
socket.on("response", (msg) => {
  switch (msg[0]) {
    case "failedJoin":
      alert("Unable to join game " + ":\n" + msg[2]);
      break;

    case "successfulJoin":
      game = msg[1];
      selfIndex = msg[2];
      console.log("Successfully joined " + game.name);
      waitingRoomName.options.text = [game.name, game.id];
      mainMenu.hide();
      mainPlayMenu.hide();
      waitingRoom.show();
      break;

    case "failedColor":
      alert("Your color has been taken");
      break;

    case "updateColors":
      game = msg[1];
      allPlayersArr[msg[2][0]].color = msg[2][1];
      allPlayersArr[msg[2][0]].component.options.color = msg[2][1];
      break;

    case "startGame":
      game = msg[1];
      startGame();
      break;

    case "regQuestion":
      game = msg[1];
      regSelfDraw(msg[2]);
      break;

    case "difQuestion":
      game = msg[1];
      difSelfDraw(msg[2]);
      break;

    case "movePlayer":
      allPlayersArr[msg[2][0]].moveTo(msg[2][1]);
      break;

    case "answerResult":
      game = msg[1];
      problemMenu.hide();
      displayResult(msg[2]);
      break;

    case "endGame":
      game = msg[1];
      endGame(msg[2]);
      break;
  }
});
