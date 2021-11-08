var circles = [];

var container;
var canvas;
var context;

var myPlayer;
var myBall;

var PLAYER_SPEED = 6;
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

function main() {
  container = document.getElementById("gameContainer");
  onResize();
  window.onresize = function () {
    onResize();
  };

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

  lstTuiles.push(new tuile(100, 100, "yellow", this.canvasWidth / 2 - 50, 200));

  initControls();

  generateCanvas();
}

function loadTuiles() {}

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

  console.log();
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
  // context.font = "30px Arial";
  // context.fillStyle = "black";
  // context.fillText("Score : " + score, 10, 50);
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  lstTuiles = lstTuiles.filter((o) => o.toDestroy === false);
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
  clearInterval(intervalDraw);
  clearInterval(intervalObstacle);
  alert("Echec, Score : " + score);
  // window.location.reload(true);
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

    bounceBall(this);

    ctx = context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function bounceBall(object) {
  if (checkCollision(object, myBall)) {
    if (
      (myBall.y > object.y || myBall.y < object.y + object.height) &&
      myBall.x > object.x &&
      myBall.x < object.x + object.width
    )
      myBall.vector[1] = -myBall.vector[1];
    else if (
      (myBall.x > object.x || myBall.x < object.x + object.width) &&
      myBall.y > object.y &&
      myBall.y < object.y + object.height
    )
      myBall.vector[0] = -myBall.vector[0];
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

function tuile(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.toDestroy = false;

  this.update = function () {
    ctx = context;
    ctx.fillStyle = color;
    if (checkCollision(this, myBall) && !this.toDestroy) {
      this.toDestroy = true;
      bounceBall(this);
    } else {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}

window.onload = function () {
  main();
};
