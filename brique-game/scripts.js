var circles = [];

var container;
var canvas;
var context;

var myPlayer;
var myBall;

var PLAYER_SPEED = 10;
var OBSTACLE_SPEED = 1;
var BALL_SPEED = 5;

var intervalDraw;
var intervalObstacle;

var canvasWidth;
var canvasHeight;

var maxHeight;
var maxWidth;

var score = 0;

var lstTuiles = [];

var isStarted = false;

var level = 7;
var MAX_LEVEL = 6;

function main() {
  container = document.getElementById("gameContainer");
  onResize();
  window.onresize = function () {
    onResize();
  };

  isStarted = false;
  myPlayer = new player(
    100,
    20,
    "blue",
    this.canvasWidth / 2 - 50,
    this.canvasHeight - 80
  );

  myBall = new ball(
    10,
    10,
    "red",
    this.canvasWidth / 2 - 5,
    this.canvasHeight - 100
  );

  startNewGame();

  initControls();

  generateCanvas();
}

function loadTuiles(level) {
  if (level <= MAX_LEVEL) {
    fetch("levels/level" + level + ".json")
      .then((response) => response.json())
      .then((json) => {
        lstTuiles = [];
        json.forEach((element) => {
          lstTuiles.push(
            new tuile(
              this.canvasWidth / 15,
              this.canvasHeight / 2 / 7,
              element.level,
              (this.canvasWidth / 15) * element.position[1],
              (this.canvasHeight / 2 / 7) * element.position[0]
            )
          );
        });
      });
  } else {
    lstTuiles = [];
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 8; j++) {
        let r = Math.floor(Math.random() * 2);
        if (r > 0) {
          lstTuiles.push(
            new tuile(
              canvasWidth / 15,
              canvasHeight / 2 / 7,
              Math.floor(Math.random() * 3) + 1,
              (canvasWidth / 15) * i,
              (canvasHeight / 2 / 7) * j
            )
          );
        }
      }
    }
  }
}

function generateCanvas() {
  canvas = document.createElement("canvas");

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context = canvas.getContext("2d");
  container.appendChild(canvas);

  intervalDraw = setInterval(updateGameArea, 20);
}

function startGame() {
  isStarted = true;

  let x = 0;
  x =
    (myPlayer.x + myPlayer.width / 2 - canvasWidth / 2) / (myPlayer.width / 2);

  x = x * -1;
  if (x < -1) x = -1;
  if (x > 1) x = 1;
  myBall.vector = [x, -1];
}

function updateGameArea() {
  clear();
  for (let index = 0; index < lstTuiles.length; index++) {
    lstTuiles[index].update();
  }
  myPlayer.update();

  myBall.update();
  context.font = "20px Arial";
  context.fillStyle = "black";
  context.fillText("Level : " + level, 10, 50);
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  lstTuiles = lstTuiles.filter((o) => o.level > 0);
  if (lstTuiles.length === 0 && isStarted) {
    winGame();
  }
}

/**
 * Handle window resize
 */
function onResize() {
  canvasWidth = container.clientWidth;
  canvasHeight = container.clientHeight;

  if (canvas) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  maxHeight = canvasHeight / 4;
  maxWidth = canvasWidth / 4;
}

function endGame() {
  alert("Wasted, back to level 1");
  level = 1;
  startNewGame();
}

function winGame() {
  alert("Congratulations !!!");

  level += 1;
  if (level > MAX_LEVEL) {
    alert("No more levels available, Let's random things");
  }
  
  startNewGame();
}

function startNewGame() {
  isStarted = false;

  myPlayer.isLeft = false;
  myPlayer.isRight = false;

  myPlayer.x = this.canvasWidth / 2 - 50;
  myPlayer.y = this.canvasHeight - 80;

  myBall.x = this.canvasWidth / 2 - 5;
  myBall.y = this.canvasHeight - 100;

  myBall.vector = [0, 0];

  loadTuiles(level);
}

function checkCollision(obj1, obj2) {
  // I hate simple javascript
  return !(
    parseInt(obj1.y) + parseInt(obj1.height) < parseInt(obj2.y) ||
    parseInt(obj2.y) + parseInt(obj2.height) < parseInt(obj1.y) ||
    parseInt(obj1.x) + parseInt(obj1.width) < parseInt(obj2.x) ||
    parseInt(obj2.x) + parseInt(obj2.width) < parseInt(obj1.x)
  );
}

/**
 * Init player controls
 */
function initControls() {
  window.addEventListener("keydown", (evt) => {
    if (evt.code === "ArrowLeft") {
      myPlayer.isLeft = true;
    }
    if (evt.code === "ArrowRight") {
      myPlayer.isRight = true;
    }
  });
  window.addEventListener("keyup", (evt) => {
    if (evt.code === "ArrowLeft") {
      myPlayer.isLeft = false;
    }
    if (evt.code === "ArrowRight") {
      myPlayer.isRight = false;
    }
    if (evt.code === "Space" && !isStarted) {
      startGame();
    }
  });
}

function player(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.isLeft = false;
  this.isRight = false;

  this.update = function () {
    if (this.isLeft) {
      this.x = this.x - PLAYER_SPEED > 0 ? this.x - PLAYER_SPEED : 0;
    }
    if (this.isRight) {
      this.x =
        this.x + PLAYER_SPEED < canvasWidth - width
          ? this.x + PLAYER_SPEED
          : canvasWidth - width;
    }

    bounceBall(this, true);

    ctx = context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function bounceBall(object, isPlayer = false) {
  if (checkCollision(object, myBall)) {
    // Top and Bottom
    if (
      (myBall.y > object.y || myBall.y < object.y + object.height) &&
      myBall.x > object.x &&
      myBall.x < object.x + object.width
    ) {
      if (isPlayer) {
        let x = 0;
        x =
          (myBall.x + myBall.width / 2 - object.x) /
          (object.x + object.width - object.x);
        x = x * 2 - 1;

        myBall.vector[0] = myBall.vector[0] + x;

        if (myBall.vector[0] < -1) myBall.vector[0] = -1;
        if (myBall.vector[0] > 1) myBall.vector[0] = 1;
      }
      myBall.vector[1] = -myBall.vector[1];
    }
    // Sides
    else if (
      (myBall.x > object.x || myBall.x < object.x + object.width) &&
      myBall.y > object.y &&
      myBall.y < object.y + object.height
    ) {
      myBall.vector[0] = -myBall.vector[0];
    }
  }
}

function ball(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.vector = [0, 0];

  this.update = function () {
    ctx = context;

    ctx.fillStyle = color;

    if (this.y > canvasHeight) {
      endGame();
    } else {
      if (this.y + this.vector[1] * BALL_SPEED < 0) {
        this.vector[1] = -this.vector[1];
      }

      if (
        this.x + this.vector[0] * BALL_SPEED + this.width > canvasWidth ||
        this.x + this.vector[0] * BALL_SPEED < 0
      ) {
        this.vector[0] = -this.vector[0];
      }

      this.x += this.vector[0] * BALL_SPEED;
      this.y += this.vector[1] * BALL_SPEED;

      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}

function tuile(width, height, level, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.level = level;

  this.update = function () {
    ctx = context;
    let color;
    switch (this.level) {
      case 3:
        color = "black";
        break;
      case 2:
        color = "red";
        break;
      case 1:
        color = "yellow";
        break;
      default:
        color = "yellow";
        break;
    }
    ctx.fillStyle = color;
    if (checkCollision(this, myBall)) {
      this.level--;

      bounceBall(this);
    }
    if (level > 0) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}

window.onload = function () {
  main();
};
