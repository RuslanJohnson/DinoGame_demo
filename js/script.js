let dino, obstacle, score, best, pause, gameOverTxt, topTxt;
let ScoreCount = 0;
const PlayerName = prompt("Enter nickname");
const TopPlayers = [
  [1, [0, ""]],
  [2, [0, ""]],
  [3, [0, ""]],
  [4, [0, ""]],
  [5, [0, ""]],
  [6, [0, ""]],
  [7, [0, ""]],
  [8, [0, ""]],
  [9, [0, ""]],
  [10, [0, ""]],
  [11, [0, ""]],
];

function startGame() {
  refreshTop();
  gameArea.start();
  dino = new Rect(50, 50, 30, 420);
  obstacle = new Rect(50, 50, 720, 420, "green");
  score = new Text("30px", "Arial", "Score", 30, 50);
  best = new Text("30px", "Arial", "Best", 600, 50, "red");
  top10 = new Text("30px", "Arial", "top10", 500, 50, "red");
  pause = new Text("40px", "Arial", "Pause", -345, 250, "#000");
  gameOverTxt = new Text("40px", "Arial", "Game Over", -290, 250, "#000");
}

const gameArea = {
  canvas: document.createElement("canvas"),
  speed: 1,
  gameIsOver: false,
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20 * gameArea.speed);
    window.addEventListener("keydown", function (event) {
      gameArea.key = event.keyCode;
      if (gameArea.gameIsOver) {
        document.location.href = "";
      }
    });
    window.addEventListener("keyup", function (event) {
      gameArea.key = false;
    });
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  togglePause: function () {
    if (!this.gameIsOver === true) {
      pause.x = pause.x == 345 ? -345 : 345;
      gameArea.speed = gameArea.speed == 0 ? 1 : 0;
    }
  },
  gameOver: function () {
    this.speed = 0;
    gameOverTxt.x = 290;
    this.gameIsOver = true;
    for (let i = 0; i < TopPlayers.length; i++) {
      if (PlayerName == TopPlayers[i][1][1]) {
        if (TopPlayers[i][1][0] >= ScoreCount) {
          return;
        }
        localStorage.setItem(PlayerName, ScoreCount);
        return;
      }
    }
    localStorage.setItem(PlayerName, ScoreCount);
  },
};

// CONSTRUCTORS
function Rect(width, height, x, y, color = "#000") {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.gravity = 0.5;
  this.gravitySpeed = 0;
  this.temp = 0;
  this.x = x;
  this.y = y;
  this.color = color;
  this.onGround = false;
  this.update = function () {
    ctx = gameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.newPos = function () {
    if (gameArea.speed == 1) {
      this.gravitySpeed += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY + this.gravitySpeed;
      this.hitBottom();
    } else {
      this.gravitySpeed += 0;
      this.x += 0;
      this.y += 0;
      this.hitBottom();
    }
  };
  this.hitBottom = function () {
    let gameAreaBottom = gameArea.canvas.height - this.height;
    if (this.y >= gameAreaBottom) {
      this.y = gameAreaBottom;
      this.gravitySpeed = 0;
      this.temp = 0;
      this.gravity = 0;
    }
  };
  this.isOnGround = function () {
    if (this.y == gameArea.canvas.height - this.height) {
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  };
  this.jump = function () {
    this.isOnGround();
    if (this.onGround) {
      this.gravity = -10;
    } else {
      this.gravity = 0.5;
    }
  };
  this.getDown = function () {
    this.height /= 2;
    this.y = 445;

    setTimeout(() => {
      this.height *= 2;
      this.y = 420;
    }, 100);
  };
  this.respawn = function () {
    if (this.x < -50) {
      this.x = 800;
      ScoreCount += 10;
      score.content = `Score ${ScoreCount}`;
    }
  };
  this.run = function () {
    this.speedX = -10 * gameArea.speed;
    this.isClashWith(dino);
    if (clash) {
      gameArea.gameOver();
    }
    this.respawn();
  };
  this.isClashWith = function (otherObj) {
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
    otherObj.left = otherObj.x;
    otherObj.right = otherObj.x + otherObj.width;
    otherObj.top = otherObj.y;
    otherObj.bottom = otherObj.y + otherObj.height;
    clash = false;

    if (this.top < otherObj.bottom && this.left < otherObj.right && this.right > otherObj.left) {
      clash = true;
    }
    return clash;
  };
}

function Line(fromX, fromY, toX, toY, width = 1, color = "#000") {
  this.fromX = fromX;
  this.fromY = fromY;
  this.toX = toX;
  this.toY = toY;
  this.width = width;
  this.color = color;
  this.update = function () {
    ctx = gameArea.context;
    ctx.moveTo(this.fromX, this.fromY);
    ctx.lineTo(this.toX, this.toY);
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  };
}

function Text(fontSize, fontFamily, content, x, y, color = "#000") {
  this.fontSize = fontSize;
  this.fontFamily = fontFamily;
  this.content = content;
  this.x = x;
  this.y = y;
  this.color = color;
  this.update = function () {
    ctx.font = `${this.fontSize} ${this.fontFamily}`;
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.content}`, this.x, this.y);
  };
  this.MultiUpdate = function () {
    let padY = 30;
    for (let i = 0; i < TopPlayers.length; i++) {
      ctx.font = `${this.fontSize} ${this.fontFamily}`;
      ctx.fillStyle = this.color;
      ctx.fillText(
        `${TopPlayers[i][0]} : ${TopPlayers[i][1][0]} - ${TopPlayers[i][1][1]}`,
        this.x,
        this.y + padY
      );
      padY += 30;
    }
  };
}

function isInTop(key, value) {
  if (value > TopPlayers[TopPlayers.length - 1][1][0]) {
    TopPlayers[TopPlayers.length - 1][1][1] = key;
    TopPlayers[TopPlayers.length - 1][1][0] = value;

    for (let i = TopPlayers.length - 1; i > 0; i--) {
      for (let j = TopPlayers.length - 1; j > 1 - 1; j--) {
        if (TopPlayers[j][1][0] > TopPlayers[j - 1][1][0]) {
          let temp = TopPlayers[j - 1][1];
          TopPlayers[j - 1][1] = TopPlayers[j][1];
          TopPlayers[j][1] = temp;
        }
      }
    }
  }
}

function refreshTop() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = parseInt(localStorage.getItem(key));
    isInTop(key, value);
  }
}

function updateGameArea() {
  gameArea.clear();

  switch (gameArea.key) {
    case 32:
      dino.jump();
      break;
    case 27:
      gameArea.togglePause();
      break;
    case 40:
      dino.getDown();
      break;
  }

  dino.newPos();
  obstacle.run();
  obstacle.newPos();

  dino.update();
  obstacle.update();
  score.update();
  best.update();
  top10.MultiUpdate();
  pause.update();
  gameOverTxt.update();
}

startGame();
