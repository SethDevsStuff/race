const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

const allTiles = [
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
const tileColorNames = ["red", "orange", "yellow", "green", "blue", "purple"];
const allQuestions = [
  new Question("What is 1+1?", 0, [
    { displayText: "1", optionNumber: 0 },
    { displayText: "2", optionNumber: 1 },
    { displayText: "0", optionNumber: 2 },
    { displayText: "-1", optionNumber: 3 },
  ]),
];
const allAnswers = [1];
var allGames = [];

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/raceToQuadraticCastle.html");
});

io.on("connection", (socket) => {
  var game = {};
  var index = null;
  socket.on("createRtqcRoom", (msg) => {
    allGames.push(new Game(msg, generateRoomCode()));
    game = allGames[allGames.length - 1];
    socket.join(game.id);
    index = 0;
    game.players.push(new Player(socket.id));
    socket.emit("response", ["successfulJoin", game, index]);
    console.log(game.id);
  });
  socket.on("joinRtqcGame", (msg) => {
    game = allGames.find((s) => s.id == msg);
    joinGame = true;
    if (!game) {
      socket.emit("response", ["failedJoin", {}, "Game not found"]);
      joinGame = false;
    } else if (game.players.length >= 4) {
      socket.emit("response", ["failedJoin", {}, "Game full"]);
      joinGame = false;
    }

    if (joinGame) {
      socket.join(msg);
      game.players.push(new Player(socket.id));
      index = game.players.length - 1;
      if (game.players.length == 4) {
        setTimeout(() => {
          io.to(game.id).emit("response", ["startGame", game]);
          setTimeout(() => {
            let random = Math.floor(Math.random() * allQuestions.length);
            game.currentQuestion = random;
            io.to(game.players[game.turn].id).emit("response", [
              "regQuestion",
              game,
              allQuestions[random],
            ]);
          }, 2000);
        }, 5000);
      }
      socket.emit("response", ["successfulJoin", game, index]);
    }
  });
  socket.on("selectRtqcColor", (msg) => {
    var findColor = game.players.find((c) => c.color == msg);
    if (!findColor) {
      game.players[index].color = msg;
      io.to(game.id).emit("response", ["updateColors", game, [index, msg]]);
    } else {
      socket.emit("response", ["failedColor", game]);
    }
  });
  socket.on("rtqcAnswer", (msg) => {
    if (msg == allAnswers[game.currentQuestion]) {
      var randomColor =
        tileColorNames[Math.floor(Math.random() * tileColorNames.length)];
      var nextSquare = allTiles.findIndex((s, indx) => {
        var currentLocation = game.players[index].location;
        if (currentLocation == 38) currentLocation = -1;
        return s.color == randomColor && indx > currentLocation;
      });
      if (nextSquare == undefined) {
      } else {
        socket.broadcast
          .to(game.id)
          .emit("response", ["movePlayer", game, [index, nextSquare]]);
        game.players[index].location = nextSquare;
        if (game.players[index].location == 37) {
          socket.emit("response", ["endGame", game, index]);
        }
      }
      game.nextTurn();
      socket.emit("response", ["answerResult", game, [true, randomColor]]);
      var random = Math.floor(Math.random() * allQuestions.length);
      game.currentQuestion = random;
      setTimeout(() => {
        io.to(game.players[game.turn].id).emit("response", [
          "regQuestion",
          game,
          allQuestions[random],
        ]);
      }, 2000);
    } else {
      game.nextTurn();
      socket.emit("response", ["answerResult", game, [false]]);
      var random = Math.floor(Math.random() * allQuestions.length);
      game.currentQuestion = random;
      io.to(game.players[game.turn].id).emit("response", [
        "regQuestion",
        game,
        allQuestions[random],
      ]);
    }
  });
});

function generateRoomCode() {
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  var charactersLength = characters.length;

  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function Game(name, id) {
  this.name = name;
  this.id = id;
  this.players = [];
  this.turn = 0;
  this.currentQuestion = undefined;
  this.nextTurn = function () {
    this.turn += 1;
    if (this.turn == 4) this.turn = 0;
  };
}
function Square(x, y, color, trap) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.trap = trap;
}
function Player(id) {
  this.id = id;
  this.color = "teal";
  this.location = 38;
  this.stuck = false;
}
function Question(prompt, number, choices) {
  this.prompt = prompt;
  this.number = number;
  this.choices = choices;
}
httpServer.listen(process.env.PORT || 3434);
console.log("listening on port 3434");
