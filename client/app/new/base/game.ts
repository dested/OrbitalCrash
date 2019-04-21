import {Collisions, Result} from 'collisions';
import {Simulate} from 'react-dom/test-utils';
import {GameEntity} from './entities/gameEntity';
import play = Simulate.play;
import {LivePlayerEntity} from './entities/livePlayerEntity';
import {PlayerEntity} from './entities/playerEntity';
import {Action} from './types';

export class Game {
  protected serverTick: number = 0;
  protected offsetTick: number = +new Date();
  collisionEngine: Collisions;
  entities: GameEntity[] = [];
  private readonly collisionResult: Result;

  get playerEntities(): PlayerEntity[] {
    return this.entities.filter(a => a instanceof PlayerEntity).map(a => a as PlayerEntity);
  }

  get nonPlayerEntities(): GameEntity[] {
    return this.entities.filter(a => !(a instanceof PlayerEntity));
  }

  // public world:GameWord;

  constructor() {
    this.collisionEngine = new Collisions();
    this.collisionResult = this.collisionEngine.createResult();
  }

  unprocessedActions: Action[] = [];

  get currentServerTick() {
    return this.serverTick + (+new Date() - this.offsetTick);
  }

  tick(timeSinceLastTick: number) {
    for (const entity of this.entities) {
      entity.tick(timeSinceLastTick, this.currentServerTick);
      entity.updatePolygon();
    }
    this.checkCollisions();
  }

  lockTick() {
    for (const playerEntity of this.playerEntities) {
      if (!(playerEntity instanceof LivePlayerEntity)) {
        playerEntity.lastDownAction = {};
      }
    }

    for (const action of this.unprocessedActions) {
      const entity = this.entities.find(a => a.id === action.entityId) as PlayerEntity;
      if (entity) {
        entity.handleAction(action, this.currentServerTick);
      }
    }

    this.unprocessedActions.length = 0;

    for (const entity of this.entities) {
      entity.lockTick(this.currentServerTick);
      entity.updatePolygon();
    }
  }

  protected checkCollisions() {
    this.collisionEngine.update();

    for (const entity of this.entities) {
      const potentials = entity.polygon.potentials();
      for (const body of potentials) {
        if (entity.polygon && entity.polygon.collides(body, this.collisionResult)) {
          if (entity.collide(body.entity, this.collisionResult)) {
            break;
          }
        }
      }
    }
  }

  addEntity(entity: GameEntity) {
    this.entities.push(entity);
  }
}
