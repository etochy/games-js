var circles = [];

function main() {
  var c = document.getElementById("gameContainer");
  var ctx = c.getContext("2d");
  ctx.moveTo(0, 0);
  ctx.lineTo(200, 100);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(95, 50, 40, 0, 2 * Math.PI);
  ctx.stroke();
}

function generateCircle() {
  circles.push({
    x: 50,
    y: 50,
    d: 40,
    v2: 0,
    l: 2 * Math.PI
  });
}

window.onload = function () {
  main();
};
