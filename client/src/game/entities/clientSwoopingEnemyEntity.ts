import {SwoopingEnemyEntity, SwoopingEnemyModel} from '@common/entities/swoopingEnemyEntity';
import {ClientEntity, DrawZIndex} from './clientEntity';

import {OrbitalAssets} from '../../utils/assetManager';
import {GameRules} from '@common/game/gameRules';
import {CanvasUtils} from '../../utils/canvasUtils';
import {OrbitalGame} from '@common/game/game';

export class ClientSwoopingEnemyEntity extends SwoopingEnemyEntity implements ClientEntity {
  static _whiteEnemy?: HTMLCanvasElement;
  clientDestroyedTick?: number = undefined;

  hitTimer = 0;
  zIndex = DrawZIndex.Player;

  constructor(game: OrbitalGame, messageModel: SwoopingEnemyModel) {
    super(game, messageModel);
  }

  get drawX() {
    return this.x;
  }

  get drawY() {
    return this.y;
  }

  get ship() {
    switch (this.enemyColor) {
      case 'black':
        return OrbitalAssets.assets['Enemies.enemyBlack1'];
      case 'blue':
        return OrbitalAssets.assets['Enemies.enemyBlue1'];
      case 'green':
        return OrbitalAssets.assets['Enemies.enemyGreen1'];
      case 'red':
        return OrbitalAssets.assets['Enemies.enemyRed1'];
    }
  }
  destroyClient(): void {}

  draw(context: CanvasRenderingContext2D): void {
    const ship = this.ship;
    context.save();
    context.translate(this.drawX, this.drawY);
    context.drawImage(ship.image, -ship.size.width / 2, -ship.size.height / 2);

    if (this.hitTimer > 0) {
      context.save();
      context.globalAlpha = this.hitTimer / 5;
      context.drawImage(ClientSwoopingEnemyEntity.whiteEnemy(), -ship.size.width / 2, -ship.size.height / 2);
      context.restore();
      this.hitTimer -= 1;
    }
    context.restore();

    this.drawHealth(context);
  }

  drawHealth(context: CanvasRenderingContext2D) {
    const ship = this.ship;
    context.fillStyle = 'rgba(255,255,255,0.4)';
    context.fillRect(this.drawX - ship.size.width / 2, this.drawY - ship.size.height / 2 - 8, ship.size.width, 5);
    context.fillStyle = 'rgba(254,0,0,0.4)';
    context.fillRect(
      this.drawX - ship.size.width / 2 + 1,
      this.drawY - ship.size.height / 2 + 1 - 8,
      (ship.size.width - 2) * (this.health / GameRules.enemies.swoopingEnemy.startingHealth),
      3
    );
  }

  reconcileFromServer(messageModel: SwoopingEnemyModel) {
    const wasHit = this.hit;
    super.reconcileFromServer(messageModel);
    if (this.hit !== wasHit) {
      this.hitTimer = 5;
    }
  }

  tick() {}

  static whiteEnemy() {
    if (!this._whiteEnemy) {
      this._whiteEnemy = CanvasUtils.mask(OrbitalAssets.assets['Enemies.enemyBlack1'], 255, 255, 255);
    }
    return this._whiteEnemy!;
  }
}
