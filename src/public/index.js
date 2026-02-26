function ConnectToServer() {
  const socket = io('http://localhost:3000');
  socket.on('connect', () => {
    console.log('Connected to server!', socket.id);
    setupKeyEvents(socket);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
  return socket;
}
const socket = ConnectToServer();

socket.on('gamestate', (event) => {
  console.log('movement detected!');
  player1.y = event.player1.y;
  player2.y = event.player2.y;
  ball.x = event.ball.x;
  ball.y = event.ball.y;
});
//drawing stuff
const pingpong = document.getElementById('pingpong');
const ctx = pingpong.getContext('2d');

const ball = {
  x: pingpong.width / 2 + 1,
  y: pingpong.height / 2,
  radius: 7,
  speedX: 5,
  speedY: 8,
  color: '#dde8e3',
};

const player1 = {
  x: 5,
  y: pingpong.height / 2 - 25,
  width: 10,
  height: 50,
  color: '#e9e3e3c4',
};

const player2 = {
  x: pingpong.width - 15,
  y: pingpong.height / 2 - 25,
  width: 10,
  height: 50,
  color: '#e9e3e3c4',
};

function makeRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
function createLine() {
  ((ctx.fillStyle = '#ede6e6c0'),
    ctx.fillRect(pingpong.width / 2, 0, 2, pingpong.height));
}
function makeCircle(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

keys = {
  player1up: false,
  player1down: false,
  player2up: false,
  player2down: false,
};
//key events registration
function setupKeyEvents(socket) {
  const keys = {
    player1up: false,
    player1down: false,
    player2up: false,
    player2down: false,
  };
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w') {
      keys.player1up = true;
      console.log('Moving up player: 1');
      socket.emit('paddleMove', { player: 1, direction: 'up' });
    }
    if (key === 'arrowup') {
      keys.player2up = true;
      console.log('moving  up player 2');
      socket.emit('paddleMove', { player: 2, direction: 'up' });
    }

    if (key === 's') {
      keys.player1down = true;
      console.log('Moving down player: 1');
      socket.emit('paddleMove', { player: 1, direction: 'down' });
    }
    if (key === 'arrowdown') {
      keys.player2down = true;
      console.log('moving down player: 2');
      socket.emit('paddleMove', { player: 2, direction: 'down' });
    }
    w;
  });
  document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w') {
      keys.player1up = false;
      console.log('Stop moving player: 1');
      socket.emit('paddleMove', { player: 1, direction: 'stop' });
    }
    if (key === 'arrowup') {
      keys.player2up = false;
      console.log('Stop moving player: 2');
      socket.emit('paddleMove', { player: 1, direction: 'stop' });
    }
    if (key === 's') {
      keys.player1down = false;
      console.log('stop moving player: 1');
      socket.emit('paddleMove', { player: 2, direction: 'stop' });
    }
    if (key === 'arrowdown') {
      keys.player2down = false;
      console.log('stop moving player: 2');
      socket.emit('paddleMove', { player: 2, direction: stop });
    }
  });
}
function draw() {
  ctx.fillStyle = '#4848cc';
  ctx.fillRect(0, 0, pingpong.width, pingpong.height);
  ctx.beginPath();
  createLine();
  makeRect(player1.x, player1.y, player1.width, player1.height, player1.color);
  makeRect(player2.x, player2.y, player2.width, player2.height, player2.color);
  makeCircle(ball.x, ball.y, ball.radius, ball.color);
}
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
