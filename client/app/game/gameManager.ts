import {Network} from "./network";
import {MessageType} from "@common/messages";
import {ClientBoard} from "./clientBoard";

export class GameManager {
    private static _instance: GameManager;
    static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    constructor() {
        this.network = new Network();
    }

    private network: Network;
    board: ClientBoard | null;


    joinGame(playerName: string, statusChange: (status: 'fail' | 'connecting' | 'joining' | 'joined') => void) {
        this.network.connect(() => {
            statusChange("joining");
            this.network.sendMessage({type: MessageType.PlayerStart, playerName});
        }, message => {
            switch (message.type) {
                case MessageType.GameStart:
                    this.board = new ClientBoard();
                    this.board.loadBoard(message.data,message.tick);
                    statusChange('joined');
                    break;
            }
        });
    }

    die() {
        this.board = null;
        this.network.disconnect();
    }
}