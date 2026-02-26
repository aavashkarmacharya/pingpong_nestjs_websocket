import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SpannerDriver } from 'typeorm/driver/spanner/SpannerDriver.js';
import { PlainObjectToNewEntityTransformer } from 'typeorm/query-builder/transformer/PlainObjectToNewEntityTransformer.js';

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
      x: 15,
      y: 45,
      width: 10,
      height: 50,
      speed: 0,
    },
    player2: {
      x: 975,
      y: 45,
      width: 10,
      height: 50,
      speed: 0,
    },
    ball: {
      x: 151,
      y: 65,
      radius: 7,
      speedX: 5,
      speedY: 8,
    },
  };
  handleConnection(client: Socket) {
    console.log(`Player has joined! ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Player has disconnected! ${client.id}`);
  }
  @SubscribeMessage('paddleMove')
  handlePaddle(client: Socket, data: { player: number; direction: string }) {
    const player = data.player;
    const direction = data.direction;
    if (player === 1) {
      if (direction === 'up') {
        this.gamestate.player1.speed = -2;
      }
      if (direction === 'down') {
        this.gamestate.player1.speed = 2;
      }
      if (direction === 'stop') {
        this.gamestate.player1.speed = 0;
      }
      this.gamestate.player1.y += this.gamestate.player1.speed;
    }
    if (player === 2) {
      if (direction === 'up') {
        this.gamestate.player2.speed = -2;
      }
      if (direction === 'down') {
        this.gamestate.player2.speed = 2;
      }
      if (direction === 'stop') {
        this.gamestate.player2.speed = 0;
      }

      this.gamestate.player2.y += this.gamestate.player2.speed;
    }
    console.log(`Player ${player} has moved!`);
    this.server.emit('gamestate', this.gamestate);
  }
}
