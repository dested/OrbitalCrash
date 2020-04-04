import {GameConstants} from '@common/game/gameConstants';
import {ClientToServerMessage, ServerToClientMessage} from '@common/models/messages';
import {ClientToServerMessageParser} from '@common/parsers/clientToServerMessageParser';
import {ServerToClientMessageParser} from '@common/parsers/serverToClientMessageParser';
import {ClientConfig} from './clientConfig';

export class ClientSocket implements IClientSocket {
  private socket?: WebSocket;
  connect(
    serverPath: string,
    options: {
      onOpen: () => void;
      onMessage: (messages: ServerToClientMessage[]) => void;
      onDisconnect: () => void;
    }
  ) {
    let totalLength = 0;
    this.socket = new WebSocket(ClientConfig.websocketUrl(serverPath));
    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = () => {
      options.onOpen();
      console.count('opened');
    };
    this.socket.onerror = (e) => {
      // console.log(e.toString());
      console.log(JSON.stringify(e, null, 2));
      this.socket?.close();
      options.onDisconnect();
    };
    this.socket.onmessage = (e) => {
      if (GameConstants.binaryTransport) {
        totalLength += (e.data as ArrayBuffer).byteLength;
        options.onMessage(ServerToClientMessageParser.toServerToClientMessages(e.data));
      } else {
        totalLength += e.data.length;
        options.onMessage(JSON.parse(e.data));
      }
      // console.log((totalLength / 1024).toFixed(2) + 'kb');
    };
    this.socket.onclose = () => {
      options.onDisconnect();
    };
  }

  sendMessage(message: ClientToServerMessage) {
    if (!this.socket) {
      throw new Error('Not connected');
    }
    try {
      if (GameConstants.binaryTransport) {
        this.socket.send(ClientToServerMessageParser.fromClientToServerMessage(message));
      } else {
        this.socket.send(JSON.stringify(message));
      }
    } catch (ex) {
      console.error('disconnected??');
    }
  }

  disconnect() {
    this.socket?.close();
  }
}

export interface IClientSocket {
  connect(
    serverPath: string,
    options: {
      onOpen: () => void;
      onMessage: (messages: ServerToClientMessage[]) => void;
      onDisconnect: () => void;
    }
  ): void;

  sendMessage(message: ClientToServerMessage): void;

  disconnect(): void;
}
