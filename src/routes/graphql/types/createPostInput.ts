import { GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';

export const createPostInput = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type:  new GraphQLNonNull(GraphQLString) },
        userId: { type:  new GraphQLNonNull(GraphQLString) },
    })
});
