// set the canvas
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// create the user paddle

const user = {
    x: 20, // X coordinate of the the user paddle
    y: canvas.height / 2 - 100 / 2, // Y coordinate of the user's paddle
    width: 10, // width of the paddle
    height: 100, // height of the paddle
    color: "TOMATO", // color of the paddle
    score: 0 // default score of the user
}

// create the computer paddle

const com = {
    x: canvas.width - 30, // X coordinate of the the computer paddle
    y: canvas.height / 2 - 100 / 2, // Y coordinate of the computer's paddle
    width: 10, // width of the paddle
    height: 100, // height of the paddle
    color: "GREENYELLOW", // color of the paddle
    score: 0 // default score of the computer
}

// create the ball

const ball = {
    x: canvas.width / 2, // X coordinate of the ball
    y: canvas.height / 2, // Y coordinate of the ball
    radius: 10, // radius of the ball
    speed: 5, // default speed of the ball
    velocityX: 5, // default velocity of the ball at X coordinate
    velocityY: 5, // default velocity of the ball at Y coordinate
    color: "GOLD" // color of the ball
}

// draw rect function

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// create the net

const net = {
    x: canvas.width / 2 - 1, // X coordinate of the net
    y: 0, // Y coordinate of the net
    width: 2, // width of each part of the net
    height: 10, // height of each part of the net
    color: "WHITE" // color of the net
}

// draw net

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw Circle

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// draw Text

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px sans-serif";
    context.fillText(text, x, y);
}

// render the game

function render() {
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "DARKBLUE");

    // draw the net
    drawNet();

    // draw score
    drawText(user.score, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

    // draw the user and computer paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// control the user paddle

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(event) {
    let rect = canvas.getBoundingClientRect();

    user.y = event.clientY - rect.top - user.height / 2;
}

// collision detection function

function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;

}

// reset ball

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// update : pos, mov, score, ...

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI to control computer paddle

    let aiLevel = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * aiLevel;


    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? user : com;

    if (collision(ball, player)) {

        // where the ball will hit the player
        let collidePoint = (ball.y - (player.y + player.height / 2));

        // normalization
        collidePoint = collidePoint / (player.height / 2);

        // calculate angle in Radian
        let angleRad = collidePoint * (Math.PI / 4);

        // X direction of the ball when it's hit
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        //change velocity of X & Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // everytime the ball hits the paddle the game speed is increased
        ball.speed += 0.5;


    }

    // update the score

    if (ball.x - ball.radius < 0) {
        // the computer wins
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        // the user wins
        user.score++;
        resetBall();
    }
}

// game init

function game() {
    update();
    render();
}

//loop

const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);