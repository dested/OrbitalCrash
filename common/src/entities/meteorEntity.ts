import {Result} from 'collisions';
import {Game, OrbitalGame} from '../game/game';
import {Entity, EntityModel, EntityModelSchema} from './entity';
import {GameConstants} from '../game/gameConstants';
import {Utils} from '../utils/utils';
import {nextId} from '../utils/uuid';
import {isPlayerWeapon} from './weapon';
import {DropEntity} from './dropEntity';
import {ImpliedEntityType} from '../models/serverToClientMessages';
import {EntityModelSchemaType} from '../models/serverToClientMessages';

export type Size = 'big' | 'med' | 'small' | 'tiny';

export class MeteorEntity extends Entity {
  health: number;
  hit = false;
  meteorColor: 'brown' | 'grey';
  meteorType: '1' | '2' | '3' | '4';
  momentumX: number;
  momentumY: number;
  positionBuffer: {rotate: number; time: number; x: number; y: number}[] = [];
  rotate: number;
  rotateSpeed: number;
  size: Size;
  startingMomentumY: number;
  type = 'meteor' as const;

  constructor(public game: OrbitalGame, messageModel: ImpliedEntityType<MeteorModel>) {
    super(game, messageModel);

    this.meteorColor = messageModel.meteorColor;
    this.size = messageModel.size;
    this.meteorType = messageModel.meteorType;
    this.rotate = messageModel.rotate;
    this.startingMomentumY = messageModel.momentumY;
    this.momentumX = messageModel.momentumX;
    this.momentumY = messageModel.momentumY;
    this.rotateSpeed = messageModel.rotateSpeed;

    switch (messageModel.size) {
      case 'big':
        switch (messageModel.meteorType) {
          case '1':
            this.boundingBoxes = [{width: 101, height: 84}];
            break;
          case '2':
            this.boundingBoxes = [{width: 120, height: 98}];
            break;
          case '3':
            this.boundingBoxes = [{width: 89, height: 82}];
            break;
          case '4':
            this.boundingBoxes = [{width: 98, height: 96}];
            break;
        }
        break;
      case 'med':
        switch (messageModel.meteorType) {
          case '1':
            this.boundingBoxes = [{width: 43, height: 43}];
            break;
          case '2':
            this.boundingBoxes = [{width: 45, height: 40}];
            break;
        }
        break;
      case 'small':
        switch (messageModel.meteorType) {
          case '1':
            this.boundingBoxes = [{width: 28, height: 28}];
            break;
          case '2':
            this.boundingBoxes = [{width: 29, height: 26}];
            break;
        }
        break;
      case 'tiny':
        switch (messageModel.meteorType) {
          case '1':
            this.boundingBoxes = [{width: 18, height: 18}];
            break;
          case '2':
            this.boundingBoxes = [{width: 16, height: 15}];
            break;
        }
        break;
    }
    switch (messageModel.size) {
      case 'big':
        this.health = Math.floor(4 + Math.random() * 2);
        break;
      case 'med':
        this.health = Math.floor(3 + Math.random() * 2);
        break;
      case 'small':
        this.health = Math.floor(2 + Math.random() * 2);
        break;
      case 'tiny':
        this.health = 1;
        break;
    }
    this.createPolygon();
  }

  get realX() {
    return this.x;
  }

  get realY() {
    return this.y;
  }

  collide(otherEntity: Entity, collisionResult: Result): boolean {
    if (isPlayerWeapon(otherEntity)) {
      otherEntity.hurt(
        1,
        this,
        collisionResult.overlap * collisionResult.overlap_x * 2,
        collisionResult.overlap * collisionResult.overlap_y * 2
      );
      this.hurt(
        otherEntity.damage,
        otherEntity,
        -collisionResult.overlap * collisionResult.overlap_x,
        -collisionResult.overlap * collisionResult.overlap_y
      );
      return true;
    }
    return false;
  }

  gameTick(duration: number) {
    this.rotate += this.rotateSpeed;
    this.x += this.momentumX;
    this.y += this.momentumY;

    if (this.momentumY < this.startingMomentumY) {
      this.momentumY += 0.1;
    }
    if (this.y > GameConstants.screenSize.height * 1.3) {
      this.destroy();
    }
    if (this.y < -GameConstants.screenSize.height * 1.3) {
      this.destroy();
    }
  }

  interpolateEntity(renderTimestamp: number) {
    const buffer = this.positionBuffer;

    while (buffer.length >= 2 && buffer[1].time <= renderTimestamp) {
      buffer.shift();
    }

    if (buffer.length >= 2 && buffer[0].time <= renderTimestamp) {
      const x0 = buffer[0].x;
      const x1 = buffer[1].x;

      const y0 = buffer[0].y;
      const y1 = buffer[1].y;

      const rotate0 = buffer[0].rotate;
      let rotate1 = buffer[1].rotate;

      if (rotate1 < rotate0) {
        rotate1 += 255;
      }
      const t0 = buffer[0].time;
      const t1 = buffer[1].time;

      this.x = x0 + ((x1 - x0) * (renderTimestamp - t0)) / (t1 - t0);
      this.y = y0 + ((y1 - y0) * (renderTimestamp - t0)) / (t1 - t0);
      this.rotate = rotate0 + ((rotate1 - rotate0) * (renderTimestamp - t0)) / (t1 - t0);
    }
  }

  postTick() {
    super.postTick();
    this.hit = false;
  }

  reconcileFromServer(messageModel: MeteorModel) {
    if (messageModel.create) {
      this.x = messageModel.x;
      this.y = messageModel.y;
      this.positionBuffer.push({
        time: +new Date() - GameConstants.serverTickRate,
        x: messageModel.x,
        y: messageModel.y,
        rotate: messageModel.rotate,
      });
    }
    this.positionBuffer.push({
      time: +new Date(),
      x: messageModel.x,
      y: messageModel.y,
      rotate: messageModel.rotate,
    });
    this.momentumX = messageModel.momentumX;
    this.momentumY = messageModel.momentumY;
    /*this.x = messageModel.x;
    this.y = messageModel.y;
    this.rotate = messageModel.rotate;*/
    this.rotateSpeed = messageModel.rotateSpeed;
    this.meteorColor = messageModel.meteorColor;
    this.size = messageModel.size;
    this.meteorType = messageModel.meteorType;
    this.hit = messageModel.hit;
  }

  serialize(): MeteorModel {
    return {
      ...super.serialize(),
      meteorType: this.meteorType,
      meteorColor: this.meteorColor,
      size: this.size,
      momentumX: this.momentumX,
      momentumY: this.momentumY,
      rotateSpeed: this.rotateSpeed,
      rotate: this.rotate,
      type: 'meteor',
      hit: this.hit,
    };
  }

  updatePolygon() {
    super.updatePolygon();
    if (this.boundingBoxes[0].polygon) this.boundingBoxes[0].polygon.angle = Utils.byteDegToRad(this.rotate);
  }

  private hurt(damage: number, otherEntity: Entity, x: number, y: number) {
    if (this.markToDestroy) return;
    if (!isPlayerWeapon(otherEntity)) {
      return;
    }
    this.health -= damage;
    this.hit = true;
    this.momentumX += x;
    this.momentumY += y;
    if (!this.game.isClient) {
      if (this.health <= 0) {
        if (Utils.random(50)) {
          const drop = new DropEntity(this.game, {
            entityId: nextId(),
            x: this.x,
            y: this.y,
            drop: DropEntity.randomDrop(this.size),
          });
          this.game.entities.push(drop);
          this.game.explode(this, 'small');
        }
      }
    }
  }

  static randomMeteor() {
    const meteorColor = Utils.randomElement(['brown' as const, 'grey' as const]);
    const size = Utils.randomElement(['big' as const, 'med' as const, 'small' as const, 'tiny' as const]);
    const type =
      size === 'big'
        ? Utils.randomElement(['1' as const, '2' as const, '3' as const, '4' as const])
        : Utils.randomElement(['1' as const, '2' as const]);

    return {meteorColor, size, type};
  }
}

export type MeteorModel = EntityModel & {
  hit: boolean;
  meteorColor: 'brown' | 'grey';
  meteorType: '1' | '2' | '3' | '4';
  momentumX: number;
  momentumY: number;
  rotate: number;
  rotateSpeed: number;
  size: 'big' | 'med' | 'small' | 'tiny';
  type: 'meteor';
};
export const MeteorModelSchema: EntityModelSchemaType<'meteor'> = {
  ...EntityModelSchema,
  rotate: 'uint8',
  hit: 'boolean',
  rotateSpeed: 'int8',
  momentumX: 'float32',
  momentumY: 'float32',
  size: {
    flag: 'enum',
    big: 1,
    small: 2,
    tiny: 3,
    med: 4,
  },
  meteorColor: {
    flag: 'enum',
    brown: 1,
    grey: 2,
  },
  meteorType: {
    flag: 'enum',
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
  },
};
