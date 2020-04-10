import {LivePlayerModel, PlayerInput, PlayerModel, PlayerWeapon} from '@common/entities/playerEntity';
import {assertType, Utils} from '@common/utils/utils';
import {ClientEntity, DrawZIndex} from './clientEntity';
import {ClientGame} from '../clientGame';
import {ClientPlayerEntity} from './clientPlayerEntity';

type KeyInput = Omit<PlayerInput, 'inputSequenceNumber'>;

export class ClientLivePlayerEntity extends ClientPlayerEntity implements ClientEntity {
  keys: KeyInput = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
    weapon: 'none',
  };

  positionLerp?: {duration: number; startTime: number; x: number; y: number};
  zIndex = DrawZIndex.Player;
  constructor(private clientGame: ClientGame, public messageModel: LivePlayerModel) {
    super(clientGame, messageModel);
    this.lastProcessedInputSequenceNumber = messageModel.lastProcessedInputSequenceNumber;
  }

  get drawX(): number {
    if (!this.positionLerp) {
      return this.x;
    } else {
      const {x, y, startTime, duration} = this.positionLerp;
      const now = +new Date();
      if (now >= startTime + duration) {
        return this.x;
      } else {
        return Utils.lerp(x, this.x, (now - startTime) / duration);
      }
    }
  }

  get drawY(): number {
    if (!this.positionLerp) {
      return this.y;
    } else {
      const {x, y, startTime, duration} = this.positionLerp;
      const now = +new Date();
      if (now >= startTime + duration) {
        return this.y;
      } else {
        return Utils.lerp(y, this.y, (now - startTime) / duration);
      }
    }
  }

  gameTick(): void {
    super.gameTick();
  }

  interpolateEntity(renderTimestamp: number) {
    // live entity does not need to interpolate anything
  }

  processInput(duration: number) {
    if (!this.positionLerp) {
      this.positionLerp = {
        x: this.x,
        y: this.y,
        startTime: +new Date(),
        duration,
      };
    } else {
      this.positionLerp.x = this.x;
      this.positionLerp.y = this.y;
      this.positionLerp.startTime = +new Date();
      this.positionLerp.duration = duration;
    }

    const input = {
      ...this.keys,
      inputSequenceNumber: this.inputSequenceNumber++,
    };

    this.pendingInputs.push(input);
    const weaponChanged = this.keys.weapon !== this.selectedWeapon;
    this.applyInput(input);

    if (this.keys.shoot || this.keys.left || this.keys.right || this.keys.up || this.keys.down || weaponChanged) {
      this.clientGame.sendInput(input);
    }
    if (weaponChanged) {
      this.clientGame.options.onUIUpdate(this.clientGame);
    }
  }

  reconcileFromServer(messageModel: LivePlayerModel | PlayerModel) {
    assertType<LivePlayerModel>(messageModel);
    super.reconcileFromServerLive(messageModel);

    if (this.dead) {
      this.clientGame.died();
    }
    let spliceIndex = -1;
    for (let i = 0; i < this.pendingInputs.length; i++) {
      const input = this.pendingInputs[i];
      if (input.inputSequenceNumber <= messageModel.lastProcessedInputSequenceNumber) {
        spliceIndex = i;
      } else {
        this.applyInput(input);
        this.updatedPositionFromMomentum();
      }
    }
    if (spliceIndex >= 0) {
      this.pendingInputs.splice(0, spliceIndex + 1);
    }
  }

  setKey<Key extends keyof KeyInput>(input: Key, value: KeyInput[Key]) {
    this.keys[input] = value;
  }

  tick() {}
}
