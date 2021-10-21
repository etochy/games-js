var width = 0;
var height = 0;

var speed = 3;
const PLAYERSPEED = 2;

var speedObstacles = 1;

var intervalPlayer;
var intervalObstacles;

var isUp = false;
var isDown = false;
var isLeft = false;
var isRight = false;

var score = 0;

var container;
var player;

function main() {
  initGame();
}

/**
 * Init Game
 */
function initGame() {
  container = document.getElementById("gameContainer");
  onResize();
  window.onresize = function () {
    onResize();
  };
  createPlayer();

  intervalObstacles = setInterval(handleAdvance, speedObstacles);
  intervalPlayer = setInterval(movePlayer, 1);
  initControls();
  generateObstacle();
}

/**
 * Init player
 */
function createPlayer() {
  if (player) {
    container.removeChild(player);
  }

  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;

  player = document.createElement("div");
  player.className = "player";
  let t = height / 2;
  player.style.top = `${t}px`;
  player.style.left = "100px";

  player.style.height = "10px";
  player.style.width = "10px";
  container.appendChild(player);
}

/**
 * Init player controls
 */
function initControls() {
  window.addEventListener("keydown", (evt) => {
    if (evt.code === "ArrowUp") {
      isUp = true;
    }
    if (evt.code === "ArrowDown") {
      isDown = true;
    }
    if (evt.code === "ArrowLeft") {
      isLeft = true;
    }
    if (evt.code === "ArrowRight") {
      isRight = true;
    }
  });
  window.addEventListener("keyup", (evt) => {
    if (evt.code === "ArrowUp") {
      isUp = false;
    }
    if (evt.code === "ArrowDown") {
      isDown = false;
    }
    if (evt.code === "ArrowLeft") {
      isLeft = false;
    }
    if (evt.code === "ArrowRight") {
      isRight = false;
    }
  });
}

/**
 * Handle player movments
 */
function movePlayer() {
  if (isUp) {
    let p = parseInt(getPx(player.style.top)) - PLAYERSPEED;
    player.style.top = `${p >= 0 && p <= height ? p : height-5}px`;
  }
  if (isDown) {
    let p = parseInt(getPx(player.style.top)) + PLAYERSPEED;
    player.style.top = `${p >= 0 && p <= height ? p : 0}px`;
  }
  if (isLeft) {
    let p = parseInt(getPx(player.style.left)) - PLAYERSPEED;
    player.style.left = `${p >= 0 && p <= width ? p : 0}px`;
  }
  if (isRight) {
    let p = parseInt(getPx(player.style.left)) + PLAYERSPEED;
    player.style.left = `${p >= 0 && p <= width ? p : 0}px`;
  }
}

/**
 * Generate new obstacle
 */
function generateObstacle() {
  let obs = document.createElement("div");
  obs.className = "obstacle";
  let l = width;
  obs.style.left = `${l}px`;

  let t = Math.random() * height;
  let h = Math.random() * (100 - 20) + 20;
  let w = Math.random() * (100 - 20) + 20;

  obs.style.top = `${t}px`;
  obs.style.height = `${h}px`;
  obs.style.width = `${w}px`;

  container.appendChild(obs);

  let x = Math.random() * (200 - 50) + 50;
  setTimeout(generateObstacle, x);
}

/**
 * Handle window resize
 */
function onResize() {
  width = container.clientWidth;
  height = container.clientHeight;
}

/**
 * move obstcales
 */
function handleAdvance() {
  let obstacles = document.getElementsByClassName("obstacle");

  for (const obs of obstacles) {
    let l = parseInt(getPx(obs.style.left) - speed);
    if (l < 0) {
      // destroy obstacle
      container.removeChild(obs);
      scorePlus();
    } else {
      obs.style.left = `${l}px`;
    }

    if (detectCollision(player, obs)) endGame();
  }
}

/**
 * Detect collision between two square objects
 * @param {*} a
 * @param {*} b
 * @returns
 */
function detectCollision(a, b) {
  // I hate simple javascript
  return !(
    parseInt(getPx(a.style.top)) + parseInt(getPx(a.style.height)) <
      parseInt(getPx(b.style.top)) ||
    parseInt(getPx(b.style.top)) + parseInt(getPx(b.style.height)) <
      parseInt(getPx(a.style.top)) ||
    parseInt(getPx(a.style.left)) + parseInt(getPx(a.style.width)) <
      parseInt(getPx(b.style.left)) ||
    parseInt(getPx(b.style.left)) + parseInt(getPx(b.style.width)) <
      parseInt(getPx(a.style.left))
  );
}

/**
 * Get value from string
 * exemple : 100px return 100
 * @param {*} value
 * @returns
 */
function getPx(value) {
  return value.slice(value.length * -1, -2);
}

/**
 * End Gme and reload window
 */
function endGame() {
  container.removeChild(player);
  alert("You Lost");
  window.location.reload(true);
}

/**
 * Increments score and display it
 */
function scorePlus() {
  score += 1;
  let scc = document.getElementById("score");
  scc.innerHTML = score;
}

window.onload = function () {
  main();
};
