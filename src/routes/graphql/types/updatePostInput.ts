import { GraphQLString, GraphQLInputObjectType } from 'graphql';

export const updatePostInput = new GraphQLInputObjectType({
    name: 'UpdatePostInput',
    fields: () => ({
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    })
});
