import { GraphQLSchema } from 'graphql/type';
import { queryType } from './query';

export const schema = new GraphQLSchema({
    query: queryType
});
