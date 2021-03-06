import {ServerGame} from './game/serverGame';
import {ServerSocket} from './utils/serverSocket';
import {ServerSync} from './game/serverSync';
import {SecureConfig, Config} from '../../api/server-common';
import {ServerUtils} from './utils/serverUtils';

async function main() {
  console.log('Getting config');
  await SecureConfig.setup();

  console.log('Getting Path');
  const path = await ServerUtils.getLoadbalancerPath();

  const serverSocket = new ServerSocket();
  const serverSync = new ServerSync(path);

  console.log('Starting game');
  const serverGame = new ServerGame(serverSocket, serverSync);
  serverGame.init();
  console.log('Ready');
}
main()
  .then((e) => console.log('Done', e))
  .catch((e) => console.error('ERROR', e));
