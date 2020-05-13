import {ApolloServerPlugin, GraphQLServiceContext} from 'apollo-server-plugin-base';
import {SecureConfig} from '../server-common';

export class MyApolloPlugin implements ApolloServerPlugin {
  /*  requestDidStart<TContext>(requestContext: GraphQLRequestContext<TContext>): GraphQLRequestListener<TContext> | void {
    return {};
  }*/

  async serverWillStart(service: GraphQLServiceContext) {
    await SecureConfig.setup();
  }
}
