function ConnectTOServer() {
  const socket = io('http://localhost:3000/');
  socket.on('connect', () => {
    console.log('connected to server!');
  });
  return socket;
}
Socket = ConnectTOServer();

const pingpong = document.getElementById('pingpong');
const ctx = pingpong.getContext('2d');
const score = document.getElementById('score');
const start = document.getElementById('start-btn');
const ball = {
  x: pingpong.width / 2,
  y: pingpong.height / 2,
  radius: 5,
  speedX: 5,
  speedY: 8,
  color: '#dde8e3',
};
const player1 = {
  x: 10,
  y: pingpong.height / 2,
  width: 10,
  height: 50,
  color: '#e9e3e3c4',
};
const player2 = {
  x: pingpong.width - 10,
  y: pingpong.height / 2,
  width: 10,
  height: 50,
  color: '#e9e3e3c4',
};
function scorechange() {}
function makerect(x, y, width, height) {}
ctx.fillrect(x, y, width, height);
ctx.fillstyle = color;

function makecircle(x, y, radius, color) {
  ctx.beginpath();
  ctx.fillstyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

//key_Events
function getkeyevents(Socket) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'ArrowUp') {
      handlekeyupevents();
    }
    if (event.key === 'S' || event.key === 'ArrowDown') {
      handlekeydownevents();
    }
  });
}

function handlekeyupevents() {
  console.log('key up !');
}
function handlekeydownevents() {
  console.log('key down!');
}

getkeyevents();
