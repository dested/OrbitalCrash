import {Result} from 'collisions';
import {Game} from '../game/game';
import {Entity, EntityModel, EntityModelSchema} from './entity';
import {ImpliedEntityType} from '../models/entityTypeModels';
import {EntitySizeByType} from '../parsers/arrayBufferSchema';

export class SpectatorEntity extends Entity {
  entityType = 'spectator' as const;
  constructor(game: Game, messageModel: ImpliedEntityType<SpectatorModel>) {
    super(game, messageModel);
    this.createPolygon();
  }

  get realX() {
    return this.x;
  }

  get realY() {
    return this.y;
  }

  collide(otherEntity: Entity, collisionResult: Result): boolean {
    return false;
  }

  gameTick(duration: number): void {}

  serialize(): SpectatorModel {
    return {
      ...super.serialize(),
      entityType: 'spectator',
    };
  }

}

export type SpectatorModel = EntityModel & {
  entityType: 'spectator';
};

export const SpectatorModelSchema: EntitySizeByType<SpectatorModel, SpectatorModel['entityType']> = {
  entityType: 1,
  ...EntityModelSchema,
};
