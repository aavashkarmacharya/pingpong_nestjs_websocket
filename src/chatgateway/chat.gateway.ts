import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class websocketgateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private gamestate = {
    player1: {
      x: 5,
      y: 100,
      width: 10,
      height: 90,
      speed: 0,
    },
    player2: {
      x: 600 - 5,
      y: 100,
      width: 10,
      height: 90,
      speed: 0,
    },
    ball: {
      x: 300,
      y: 100,
      radius: 12,
      speedX: 3,
      speedY: 2,
    },
    score: {
      player1: 0,
      player2: 0,
    },
  };
  private gameLoopInterval: NodeJS.Timeout;
  movementspeed: number = 10;
  handleConnection(client: Socket) {
    console.log(`Player has joined! ${client.id}`);
    if (!this.gameLoopInterval) {
      this.gameloopstarter();
    }
  }
  handleDisconnect(client: Socket) {
    console.log(`Player has disconnected! ${client.id}`);
  }
  gameloopstarter() {
    console.log('game loop started!');
    this.gameLoopInterval = setInterval(() => {
      this.ballmovement();
      this.checkforcollison();
      this.server.emit('gamestate', this.gamestate);
    });
  }
  @SubscribeMessage('paddleMove')
  handlePaddle(client: Socket, data: { player: number; direction: string }) {
    const player = data.player;
    const direction = data.direction;
    if (player === 1) {
      if (direction === 'up') {
        this.gamestate.player1.speed = -this.movementspeed;
      }
      if (direction === 'down') {
        this.gamestate.player1.speed = this.movementspeed;
      }
      if (direction === 'stop') {
        this.gamestate.player1.speed = 0;
      }
      this.gamestate.player1.y += this.gamestate.player1.speed;
    }
    if (player === 2) {
      if (direction === 'up') {
        this.gamestate.player2.speed = -this.movementspeed;
      }
      if (direction === 'down') {
        this.gamestate.player2.speed = this.movementspeed;
      }
      if (direction === 'stop') {
        this.gamestate.player2.speed = 0;
      }

      this.gamestate.player2.y += this.gamestate.player2.speed;
    }
    if (this.gamestate.player1.y < 0) {
      this.gamestate.player1.y = 0;
    }
    if (this.gamestate.player2.y < 0) {
      this.gamestate.player2.y = 0;
    }
    if (this.gamestate.player1.y > 380 - this.gamestate.player1.height) {
      this.gamestate.player1.y = 380 - this.gamestate.player1.height;
    }
    if (this.gamestate.player2.y > 380 - this.gamestate.player2.height) {
      this.gamestate.player2.y = 380 - this.gamestate.player2.height;
    }
    if (direction != 'stop') {
      console.log(`Player ${player} has moved ${direction}!`);
    }
    console.log(`player ${player} has stopped!`);
    this.server.emit('gamestate', this.gamestate);
  }
  ballmovement() {
    const ball = this.gamestate.ball;
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    //vitta detection
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.speedY = -ball.speedY;
    }
    if (ball.y + ball.radius > 370) {
      ball.y = 370 - ball.radius;
      if (ball.speedY === 0) {
        ball.speedY = 2;
      } else {
        ball.speedY = -ball.speedY;
      }
    }
  }
  collisondetection(ball: any, paddle: any): boolean {
    return (
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.x + ball.radius > paddle.x &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.y + ball.radius > paddle.y
    );
  }
  spinball(ball: any, paddle: any) {
    const hitPosition =
      (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
    ball.speedY = hitPosition * 3;
  }
  resetball() {
    const ball = this.gamestate.ball;
    ball.x = 337;
    ball.y = 115;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 2;
    ball.speedY = Math.random() * 4 - 2;
    console.log('ball position reset');
  }
  checkforcollison() {
    const ball = this.gamestate.ball;
    const player1 = this.gamestate.player1;
    const player2 = this.gamestate.player2;
    if (this.collisondetection(ball, player1)) {
      console.log('player 1 has hit the ball!');
      ball.speedX = Math.abs(ball.speedX);
      ball.x = player1.x + player1.width + ball.radius;
      this.spinball(ball, player1);
    }
    if (this.collisondetection(ball, player2)) {
      console.log('player 2 had hit the ball!');
      ball.speedX = -Math.abs(ball.speedX);
      ball.x = player2.x - ball.radius;
      this.spinball(ball, player2);
    }
    if (ball.x - ball.radius < 0) {
      console.log('player 2 has scored!! ball went outside from left');
      this.gamestate.score.player1 += 1;
      this.resetball();
    }
    if (ball.x - ball.radius > 600) {
      console.log('player 1 has scored! ball went outside form right');
      this.gamestate.score.player2 += 1;
      this.resetball();
    }
  }
}
