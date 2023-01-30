import { GraphQLSchema } from 'graphql/type';
import { queryType } from './query';
import { mutationType } from './mutation';

export const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});
