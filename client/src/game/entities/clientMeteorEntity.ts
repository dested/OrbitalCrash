import {ClientEntity, DrawZIndex} from './clientEntity';

import {MeteorEntity, MeteorModel} from '@common/entities/meteorEntity';
import {Utils} from '@common/utils/utils';
import {OrbitalAssets} from '../../utils/assetManager';
import {CanvasUtils} from '../../utils/canvasUtils';
import {AssetKeys} from '../../assets';
import {OrbitalClientEngine} from '../clientEngine';
import {OrbitalGame} from '@common/game/game';

export class ClientMeteorEntity extends MeteorEntity implements ClientEntity {
  static _whiteMeteor: {[key in AssetKeys]?: HTMLCanvasElement} = {};
  clientDestroyedTick?: number = undefined;
  hitTimer = 0;
  zIndex = DrawZIndex.Scenery;

  get drawX() {
    return this.realX;
  }

  get drawY() {
    return this.realY;
  }
  destroyClient(): void {}

  draw(context: CanvasRenderingContext2D): void {
    const color = this.meteorColor === 'brown' ? 'Brown' : 'Grey';

    const asset = `Meteors.meteor${color}_${this.size}${this.meteorType}` as 'Meteors.meteorBrown_big1';
    const meteor = OrbitalAssets.assets[asset];

    context.save();
    context.translate(this.drawX, this.drawY);
    context.rotate(Utils.byteDegToRad(this.rotate));
    context.drawImage(meteor.image, -meteor.size.width / 2, -meteor.size.height / 2);

    if (this.hitTimer > 0) {
      context.save();
      context.globalAlpha = this.hitTimer / 5;
      context.drawImage(ClientMeteorEntity.whiteMeteor(asset), -meteor.size.width / 2, -meteor.size.height / 2);
      context.restore();
      this.hitTimer -= 1;
    }
    context.restore();
  }

  reconcileFromServer(messageModel: MeteorModel) {
    const wasHit = this.hit;
    super.reconcileFromServer(messageModel);
    if (this.hit !== wasHit) {
      this.hitTimer = 5;
    }
  }

  tick() {}

  static whiteMeteor(asset: AssetKeys) {
    if (!this._whiteMeteor[asset]) {
      this._whiteMeteor[asset] = CanvasUtils.mask(OrbitalAssets.assets[asset], 255, 255, 255);
    }
    return this._whiteMeteor[asset]!;
  }
}
