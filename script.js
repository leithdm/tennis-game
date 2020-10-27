let canvas;
let canvasContext;
let ballX = 350;
let ballY = 50;
let ballSpeedX = 6;
let ballSpeedY = 3;
let paddle1Y = 250;
let paddle2Y = 250;
let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 15;
const BALL_RADIUS = 5;
const PADDLE_DIST_FROM_EDGE = 30; //10% of height of canvas
let showingWinScreen = false;

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  canvasContext.font = "30px Arial";
  let framesPerSecond = 60;

  setInterval(() => {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", (evt) => {
    let mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function calculateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX =
    evt.clientX - rect.left - root.scrollLeft + PADDLE_DIST_FROM_EDGE;
  let mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = 6;
  ballSpeedY = 3;
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 15) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 15) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  //the four edges of the left paddle
  let paddle1TopEdgeX = PADDLE_DIST_FROM_EDGE + PADDLE_THICKNESS;
  let paddle1BottomEdgeX = paddle1TopEdgeX - PADDLE_THICKNESS;
  let paddle1LeftEdgeY = paddle1Y;
  let paddle1RightEdgeY = paddle1Y + PADDLE_HEIGHT;

  //the four edges of the right paddle
  let paddle2TopEdgeX = canvas.width - PADDLE_DIST_FROM_EDGE;
  let paddle2BottomEdgeX = paddle2TopEdgeX + PADDLE_THICKNESS;
  let paddle2LeftEdgeY = paddle2Y;
  let paddle2RightEdgeY = paddle2Y + PADDLE_HEIGHT;

  //logic to see if ball hits the paddle
  if (
    ballX < paddle1TopEdgeX && // ball is below the top of paddle
    ballX > paddle1BottomEdgeX - 14 && //ball is above bottom of paddle
    ballY > paddle1LeftEdgeY && //ball is to the right of the paddle left-edge
    ballY < paddle1RightEdgeY
  ) {
    //ball is to the left of the paddle right edge

    //reward for hitting ball on edge of paddle
    ballSpeedX = -ballSpeedX;
    let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
    ballSpeedY = deltaY * 0.25;
  }

  if (
    ballX > paddle2TopEdgeX && // ball is below the top of paddle
    ballX < paddle2BottomEdgeX + 14 && //ball is above bottom of paddle
    ballY > paddle2LeftEdgeY && //ball is to the right of the paddle left-edge
    ballY < paddle2RightEdgeY
  ) {
    //ball is to the left of the paddle right edge

    ballSpeedX = -ballSpeedX;
    let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
    ballSpeedY = deltaY * 0.25;
  }

  if (ballX > canvas.width) {
    // if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
    //     ballSpeedX = -ballSpeedX;

    //     //how far away we are from centre of paddle. We penalise centre, award far away
    //     let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
    //     ballSpeedY = deltaY * 0.25;
    // } else {
    player1Score++;
    ballReset();
  }

  if (ballX < 0) {
    // if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
    //     ballSpeedX = -ballSpeedX;

    //     //how far away we are from centre of paddle. We penalise centre, award far away
    //     let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
    //     ballSpeedY = deltaY * 0.35;

    // } else {
    player2Score++;
    ballReset();
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

function drawEverything() {
  //create black canvas
  colorRect(0, 0, canvas.width, canvas.height, "brown");

  if (showingWinScreen) {
    canvasContext.fillStyle = "#FFCBAA";
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("You beat the Computer !", canvas.width / 2, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Computer Wins !", canvas.width / 2 - 100, 200);
    }
    canvasContext.fillText("Click to Continue", canvas.width / 2 - 100, 500);
    return;
  }

  //draw net
  drawNet();

  //left player paddle
  colorRect(
    PADDLE_DIST_FROM_EDGE,
    paddle1Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "#758AA8"
  );

  //right player paddle
  colorRect(
    canvas.width - PADDLE_DIST_FROM_EDGE,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "#A2D890"
  );

  //draw ball
  colorCircle(ballX, ballY, BALL_RADIUS, "white");

  //score
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
