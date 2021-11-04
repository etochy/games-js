var circles = [];

var container;
var canvas;
var context;

var myPlayer;

var PLAYER_SPEED = 5;
var OBSTACLE_SPEED = 1;

var intervalDraw;
var intervalObstacle;

var canvasWidth;
var canvasHeight;

var maxHeight;
var maxWidth;

var listObstacles = [];

function main() {
  container = document.getElementById("gameContainer");
  onResize();
  window.onresize = function () {
    onResize();
  };

  myPlayer = new player(30, 30, "blue", 10, 120);

  initControls();

  generateCanvas();

  startGame();
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
  intervalObstacle = setInterval(generateObstacle, 200);
}

function generateObstacle() {
  let w = 5;
  let h = 5;
  let x = Math.random() * canvasWidth;
  let y = Math.random() * canvasHeight;

  let o = new obstacle(w, h, "orange", x, y);
  listObstacles.push(o);
}

function updateGameArea() {
  clear();
  for (let index = listObstacles.length - 1; index >= 0; index--) {
    listObstacles[index].update();
  }
  myPlayer.update();
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  listObstacles = listObstacles.filter((o) => o.toDestroy === false);
}

function player(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.isUp = false;
  this.isDown = false;
  this.isLeft = false;
  this.isRight = false;

  // this.image = new Image();
  // this.image.src = "./assets/plane.jpg";

  this.update = function () {
    if (this.isUp) {
      this.y = this.y - PLAYER_SPEED > 0 ? this.y - PLAYER_SPEED : 0;
    }
    if (this.isDown) {
      this.y =
        this.y + PLAYER_SPEED < canvasHeight - this.height
          ? this.y + PLAYER_SPEED
          : canvasHeight - this.height;
    }
    if (this.isLeft) {
      this.x = this.x - PLAYER_SPEED > 0 ? this.x - PLAYER_SPEED : 0;
    }
    if (this.isRight) {
      this.x =
        this.x + PLAYER_SPEED < canvasWidth - width
          ? this.x + PLAYER_SPEED
          : canvasWidth - width;
    }

    if (!this.isDown && !this.isUp && this.y + 1 < canvasHeight - this.height) {
      this.y += 1;
    }

    ctx = context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
}

function obstacle(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.currentX = 0;
  this.currentY = 0;

  this.toDestroy = false;

  this.update = function () {
    ctx = context;

    this.height += OBSTACLE_SPEED;
    this.width += OBSTACLE_SPEED;

    console.log(maxHeight);

    if (this.height > maxHeight - 10) {
      ctx.fillStyle = "red";
    } else ctx.fillStyle = color;

    if (this.height > maxHeight && !this.toDestroy) {
      this.toDestroy = true;
    } else {
      this.currentX = this.x - this.width / 2;
      this.currentY = this.y - this.height / 2;
      ctx.fillRect(this.currentX, this.currentY, this.width, this.height);

      if (this.height > maxHeight - 9 && checkCollision(this)) {
        endGame();
      }
    }
  };
}

function endGame() {
  alert("Echec");
  // console.log("echec");
}

function checkCollision(obs) {
  // I hate simple javascript
  return !(
    parseInt(obs.currentY) + parseInt(obs.height) < parseInt(myPlayer.y) ||
    parseInt(myPlayer.y) + parseInt(myPlayer.height) < parseInt(obs.currentY) ||
    parseInt(obs.currentX) + parseInt(obs.width) < parseInt(myPlayer.x) ||
    parseInt(myPlayer.x) + parseInt(myPlayer.width) < parseInt(obs.currentX)
  );
}

/**
 * Init player controls
 */
function initControls() {
  window.addEventListener("keydown", (evt) => {
    if (evt.code === "ArrowUp") {
      myPlayer.isUp = true;
    }
    if (evt.code === "ArrowDown") {
      myPlayer.isDown = true;
    }
    if (evt.code === "ArrowLeft") {
      myPlayer.isLeft = true;
    }
    if (evt.code === "ArrowRight") {
      myPlayer.isRight = true;
    }
  });
  window.addEventListener("keyup", (evt) => {
    if (evt.code === "ArrowUp") {
      myPlayer.isUp = false;
    }
    if (evt.code === "ArrowDown") {
      myPlayer.isDown = false;
    }
    if (evt.code === "ArrowLeft") {
      myPlayer.isLeft = false;
    }
    if (evt.code === "ArrowRight") {
      myPlayer.isRight = false;
    }
  });
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

window.onload = function () {
  main();
};
