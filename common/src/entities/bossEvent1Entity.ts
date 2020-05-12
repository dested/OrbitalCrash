import {Result} from 'collisions';
import {Game, OrbitalGame} from '../game/game';
import {Entity, EntityModel, EntityModelSchema} from '../baseEntities/entity';
import {nextId} from '../utils/uuid';
import {isPlayerWeapon} from './weaponEntity';
import {DropEntity} from './dropEntity';
import {BossEvent1EnemyEntity} from './bossEvent1EnemyEntity';
import {ImpliedEntityType} from '../models/serverToClientMessages';
import {SDTypeElement} from '../schemaDefiner/schemaDefinerTypes';
import {
  ImpliedDefaultPhysics,
  PhysicsEntity,
  PhysicsEntityModel,
  PhysicsEntityModelSchema,
} from '../baseEntities/physicsEntity';

export type BossEvent1PieceType = 'nose' | 'body1' | 'body2' | 'body3' | 'bodyBack1' | 'bodyBack2';
export class BossEvent1Entity extends PhysicsEntity {
  aliveTick: number = 0;
  alwaysPresent = true;
  boundingBoxes = [
    {width: 112, height: 34, offsetY: 41},
    {width: 57, height: 41, offsetX: 35},
  ];
  damage = 2;
  explosionIntensity = 4;
  health: number = 1000;
  isWeapon = true as const;
  momentumX = 0;
  momentumY = 0;
  type = 'bossEvent1' as const;
  weaponSide = 'enemy' as const;

  constructor(public game: OrbitalGame, messageModel: ImpliedEntityType<ImpliedDefaultPhysics<BossEvent1Model>>) {
    super(game, messageModel);
    this.health = messageModel.health;
    this.width = messageModel.width;

    if (!game.isClient) {
      const nose = {name: 'Rocket_parts.spaceRocketParts_008', width: 136, height: 156};
      const body1 = {name: 'Rocket_parts.spaceRocketParts_026', width: 136, height: 128};
      const body2 = {name: 'Rocket_parts.spaceRocketParts_027', width: 136, height: 128};
      const body3 = {name: 'Rocket_parts.spaceRocketParts_028', width: 136, height: 128};
      const bodyBack1 = {name: 'Rocket_parts.spaceRocketParts_032', width: 136, height: 128};
      const bodyBack2 = {name: 'Rocket_parts.spaceRocketParts_033', width: 136, height: 128};
      const noseOffsetX = nose.width / 2;
      const bodyOffsetX = body1.width / 2;
      const bodyBackOffsetY = bodyBack1.height - 10;
      const bodyOffsetY = bodyBackOffsetY + body1.height * 2 - nose.height;
      const noseOffsetY = bodyOffsetY + nose.height;

      const entityWidth = noseOffsetX + nose.width * 14;
      const items: {asset: any; offsetX: number; offsetY: number; rotate: number; type: BossEvent1PieceType}[] = [
        {type: 'nose', asset: nose, rotate: 180, offsetX: noseOffsetX, offsetY: noseOffsetY},
        {type: 'nose', asset: nose, rotate: 180, offsetX: noseOffsetX + nose.width * 2, offsetY: noseOffsetY},
        {type: 'nose', asset: nose, rotate: 180, offsetX: noseOffsetX + nose.width * 4, offsetY: noseOffsetY},
        {type: 'nose', asset: nose, rotate: 180, offsetX: noseOffsetX + nose.width * 6, offsetY: noseOffsetY},
        {type: 'nose', asset: nose, rotate: 180, offsetX: noseOffsetX + nose.width * 8, offsetY: noseOffsetY},
        {type: 'nose', asset: nose, rotate: 180, offsetX: noseOffsetX + nose.width * 10, offsetY: noseOffsetY},
        {type: 'nose', asset: nose, rotate: 180, offsetX: noseOffsetX + nose.width * 12, offsetY: noseOffsetY},
        {type: 'nose', asset: nose, rotate: 180, offsetX: noseOffsetX + nose.width * 14, offsetY: noseOffsetY},
        {type: 'body1', asset: body1, rotate: 180, offsetX: bodyOffsetX, offsetY: bodyOffsetY},
        {type: 'body2', asset: body2, rotate: 180, offsetX: bodyOffsetX + body1.width * 2, offsetY: bodyOffsetY},
        {type: 'body3', asset: body3, rotate: 180, offsetX: bodyOffsetX + body1.width * 4, offsetY: bodyOffsetY},
        {type: 'body1', asset: body1, rotate: 180, offsetX: bodyOffsetX + body1.width * 6, offsetY: bodyOffsetY},
        {type: 'body2', asset: body2, rotate: 180, offsetX: bodyOffsetX + body1.width * 8, offsetY: bodyOffsetY},
        {type: 'body3', asset: body3, rotate: 180, offsetX: bodyOffsetX + body1.width * 10, offsetY: bodyOffsetY},
        {type: 'body3', asset: body3, rotate: 180, offsetX: bodyOffsetX + body1.width * 12, offsetY: bodyOffsetY},
        {type: 'body1', asset: body1, rotate: 180, offsetX: bodyOffsetX + body1.width * 14, offsetY: bodyOffsetY},
        {type: 'bodyBack1', asset: bodyBack1, rotate: 0, offsetX: noseOffsetX, offsetY: bodyBackOffsetY},
        {type: 'bodyBack1', asset: bodyBack1, rotate: 0, offsetX: noseOffsetX + nose.width, offsetY: bodyBackOffsetY},
        {
          type: 'bodyBack1',
          asset: bodyBack1,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 2,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack2',
          asset: bodyBack2,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 3,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack2',
          asset: bodyBack2,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 4,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack1',
          asset: bodyBack1,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 5,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack2',
          asset: bodyBack2,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 6,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack1',
          asset: bodyBack1,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 7,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack1',
          asset: bodyBack1,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 8,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack2',
          asset: bodyBack2,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 9,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack2',
          asset: bodyBack2,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 10,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack2',
          asset: bodyBack2,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 11,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack1',
          asset: bodyBack1,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 12,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack2',
          asset: bodyBack2,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 13,
          offsetY: bodyBackOffsetY,
        },
        {
          type: 'bodyBack2',
          asset: bodyBack2,
          rotate: 0,
          offsetX: noseOffsetX + nose.width * 14,
          offsetY: bodyBackOffsetY,
        },
      ];

      for (let x = 0; x < messageModel.width; x += entityWidth) {
        for (const item of items) {
          this.game.addObjectToWorld(
            new BossEvent1EnemyEntity(this.game, {
              entityId: nextId(),
              ownerEntityId: this.entityId,
              pieceType: item.type,
              xOffset: item.offsetX + x,
              yOffset: item.offsetY,
              rotate: item.rotate,
              position: {x: 0, y: 0},
            })
          );
        }
      }
    }
  }

  collide(otherEntity: Entity, collisionResult: Result): boolean {
    if (isPlayerWeapon(otherEntity)) {
      otherEntity.hurt(
        otherEntity.damage,
        this,
        collisionResult.overlap * collisionResult.overlap_x,
        collisionResult.overlap * collisionResult.overlap_y
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

  gameTick(duration: number): void {
    this.aliveTick++;
  }

  hurt(damage: number, otherEntity: Entity, x: number, y: number) {
    if (this.markToDestroy) {
      return;
    }
    this.health -= damage;
    this.momentumX += x;
    this.momentumY += y;

    if (this.health <= 0) {
      const drop = new DropEntity(this.game, {
        entityId: nextId(),
        position: this.position.model(),
        drop: DropEntity.randomDrop('big'),
      });
      this.game.addObjectToWorld(drop);
      this.game.explode(this, 'medium');
    }
  }

  isVisibleAtCoordinate(
    viewX: number,
    viewY: number,
    viewWidth: number,
    viewHeight: number,
    playerId: number
  ): boolean {
    return true;
  }

  reconcileFromServer(messageModel: BossEvent1Model) {
    super.reconcileFromServer(messageModel);
    this.health = messageModel.health;
    this.width = messageModel.width;
  }

  serialize(): BossEvent1Model {
    return {
      ...super.serialize(),
      health: this.health,
      width: this.width,
      type: 'bossEvent1',
    };
  }
}

export type BossEvent1Model = PhysicsEntityModel & {
  health: number;
  type: 'bossEvent1';
  width: number;
};

export const BossEvent1ModelSchema: SDTypeElement<BossEvent1Model> = {
  ...PhysicsEntityModelSchema,
  width: 'uint32',
  health: 'uint16',
};
