import {PlayerShieldEntity, PlayerShieldModel} from '@common/entities/playerShieldEntity';
import {ClientEntity, DrawZIndex} from './clientEntity';

import {Entity} from '@common/baseEntities/entity';
import {GameRules} from '@common/game/gameRules';
import {OrbitalAssets} from '../../utils/assetManager';
import {OrbitalGame} from '@common/game/game';

export class ClientPlayerShieldEntity extends PlayerShieldEntity implements ClientEntity {
  clientDestroyedTick?: number = undefined;
  zIndex = DrawZIndex.Effect;

  constructor(game: OrbitalGame, messageModel: PlayerShieldModel) {
    super(game, messageModel);
  }
  get drawX() {
    const owner = this.game.entities.lookup<Entity & ClientEntity>(this.ownerEntityId);
    if (!owner) {
      return this.position.x;
    }
    return this.position.x + owner.drawX;
  }
  get drawY() {
    const owner = this.game.entities.lookup<Entity & ClientEntity>(this.ownerEntityId);
    if (!owner) {
      return this.position.y;
    }
    return this.position.y + owner.drawY;
  }
  destroyClient(): void {}

  draw(context: CanvasRenderingContext2D): void {
    const owner = this.game.entities.lookup(this.ownerEntityId);
    if (!owner) {
      return;
    }

    const shield = this.getShieldAsset();
    context.save();
    context.translate(this.drawX, this.drawY);
    context.globalAlpha = this.health / GameRules.playerShield[this.shieldStrength].maxHealth;
    context.drawImage(shield.image, -shield.size.width / 2, -shield.size.height / 2);
    context.restore();
  }

  tick() {}

  private getShieldAsset() {
    switch (this.shieldStrength) {
      case 'small':
        return OrbitalAssets.assets['Effects.shield1'];
      case 'medium':
        return OrbitalAssets.assets['Effects.shield2'];
      case 'big':
        return OrbitalAssets.assets['Effects.shield3'];
    }
  }
}
