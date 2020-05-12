import {DropEntity, DropModel} from '@common/entities/dropEntity';
import {OrbitalAssets} from '../../utils/assetManager';
import {unreachable} from '@common/utils/unreachable';
import {CanvasUtils} from '../../utils/canvasUtils';
import {OrbitalGame} from '@common/game/game';
import {ClientActor, DrawZIndex} from '@common/baseEntities/clientActor';

export class DropActor extends ClientActor<DropEntity> {
  clientDestroyedTick?: number = undefined;
  zIndex = DrawZIndex.Scenery;

  get asset() {
    switch (this.entity.drop.type) {
      case 'health':
        return OrbitalAssets.assets['Power_ups.pill_blue'];
      case 'weapon':
        switch (this.entity.drop.weapon) {
          case 'rocket':
            return OrbitalAssets.assets['Missiles.spaceMissiles_001'];
          case 'laser1Spray10':
            return OrbitalAssets.assets['Lasers.laserBlue03Spray'];
          case 'laser1':
            return OrbitalAssets.assets['Lasers.laserBlue03'];
          case 'laser2':
            return OrbitalAssets.assets['Lasers.laserBlue02'];
          case 'torpedo':
            return OrbitalAssets.assets['Missiles.spaceMissiles_004'];
          default:
            throw unreachable(this.entity.drop.weapon);
        }
      case 'shield':
        switch (this.entity.drop.level) {
          case 'medium':
            return OrbitalAssets.assets['Effects.shield2'];
          case 'big':
            return OrbitalAssets.assets['Effects.shield3'];
          default:
            throw unreachable(this.entity.drop.level);
        }
      default:
        throw unreachable(this.entity.drop);
    }
  }

  destroyClient(): void {
    this.clientDestroyedTick = 5;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.clientDestroyedTick) {
      return;
    }
    const circleSize = 50;
    const size = 30;
    context.save();
    context.translate(this.entity.position.x, this.entity.position.y);
    const asset = this.asset;
    CanvasUtils.circle(context, 0, 0, circleSize / 2);
    context.strokeStyle = 'red';
    context.lineWidth = 3;
    context.stroke();
    context.drawImage(asset.image, -size / 2, -size / 2, size, size);
    context.restore();
  }

  tick() {}
}