// const axios = require('axios').default;

const PLAYERSPEED = 2;
const LOCAL_STORAGE = "astero-score";
const URL = "http://localhost:5000/asteroid-scores";

var width = 0;
var height = 0;

var speed = 3;

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

var start = false;

var pseudo = "";

function main() {
  initGame();
}

/**
 * Init Game
 */
function initGame() {
  pseudo = prompt("Please enter your pseudo", "Jhon Doe");

  container = document.getElementById("gameContainer");
  onResize();
  window.onresize = function () {
    onResize();
  };
  createPlayer();

  start = true;

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

  player.style.height = "20px";
  player.style.width = "20px";
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
    player.style.top = `${p >= 0 && p <= height ? p : height - 5}px`;
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
  if (start) {
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
  start = false;
  clearInterval(intervalObstacles);
  clearInterval(intervalPlayer);
  container.removeChild(player);
  alert("You Lost");
  saveScore();
  // displayScores();
}

function displayScores() {
  // GET scores
  // axios
  //   .get(URL)
  //   .then(function (response) {
  //     // handle success
  //     let scores = response.data;
  //     scores.sort((a, b) => {
  //       if (a.score > b.score) {
  //         return -1;
  //       } else if (a.score < b.score) {
  //         return 1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //     let scText = "Top Scores : ";
  //     scores.forEach((element) => {
  //       scText += "\n";
  //       scText += element.pseudo + " : " + element.score;
  //     });
  //     alert(scText);
  //     window.location.reload(true);
  //   })
  //   .catch(function (error) {
  //     // handle error
  //     console.log("RESPONSE", error);
  //   });

  let scores = JSON.parse(localStorage.getItem(LOCAL_STORAGE)) || [];
  scores.sort((a, b) => {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    } else {
      return 0;
    }
  });
  let scText = "Top Scores : ";
  scores.forEach((element) => {
    scText += "\n";
    scText += element.pseudo + " : " + element.score;
  });
  alert(scText);
  window.location.reload(true);
}

function saveScore() {
  // POST score
  let scores = JSON.parse(localStorage.getItem(LOCAL_STORAGE)) || [];
  scores.push({
    pseudo: pseudo,
    score: score,
  });

  localStorage.setItem(LOCAL_STORAGE, JSON.stringify(scores));
  displayScores();

  // axios
  //   .post(URL, {
  //     pseudo: pseudo,
  //     score: score,
  //   })
  //   .then(function (response) {
  //     console.log("RESPONSE", response);
  //     // handle success
  //     let scores = response.data;
  //     scores.sort((a, b) => {
  //       if (a.score > b.score) {
  //         return -1;
  //       } else if (a.score < b.score) {
  //         return 1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //     let scText = "Top Scores : ";
  //     scores.forEach((element) => {
  //       scText += "\n";
  //       scText += element.pseudo + " : " + element.score;
  //     });
  //     alert(scText);
  //     window.location.reload(true);
  //   })
  //   .catch(function (error) {
  //     // handle error
  //     console.log("RESPONSE", error);
  //   });
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
