import glamorous from 'glamorous';
import {LivePlayerActor} from '../game/entities/livePlayerActor';
import {AvailablePlayerWeapon} from '@common/entities/playerEntity';
export const boxSize = '7.5vh';

export const SelectWeaponBox = glamorous.div<{liveEntity: LivePlayerActor; weapon: AvailablePlayerWeapon}>(
  ({weapon, liveEntity}) => ({
    width: boxSize,
    height: boxSize,
    backgroundColor: 'rgba(0,0,0,.2)',
    margin: '5px',
    border: 'solid 6px ' + (liveEntity.entity.selectedWeapon === weapon.weapon ? '#c14747' : '#C2C7C8'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '25%',
  })
);
