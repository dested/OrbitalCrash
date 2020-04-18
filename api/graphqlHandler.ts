require('dotenv').config();
import {prisma} from './utils/db';
import {ApolloServer} from 'apollo-server-lambda';
import {Resolvers} from './generated/graphql';
import {MyApolloPlugin} from './gqlUtils/myOnePlugin';
import * as CommonTypeDefs from './schema/common.graphql';
import * as UserTypeDefs from './schema/user.graphql';
import * as UserInputTypeDefs from './schema/user.input.graphql';
import {DateScalar} from './gqlUtils/dateScalar';

const resolvers: Resolvers = {
  Query: {
    placeholder: () => true,
    login: (parent, args) => {
      return null;
    },
  },
  Mutation: {
    placeholder: () => true,
  },
  Date: DateScalar,
};

const server = new ApolloServer({
  plugins: [new MyApolloPlugin()],
  typeDefs: [CommonTypeDefs as any, UserTypeDefs as any, UserInputTypeDefs as any],
  resolvers: resolvers,
  playground: process.env.ISLOCAL ? true : false,
  introspection: process.env.ISLOCAL ? true : false,
  context: ({event, context}) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

exports.graphqlHandler = server.createHandler();
