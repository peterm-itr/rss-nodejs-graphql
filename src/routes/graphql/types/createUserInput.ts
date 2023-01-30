import { GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';

export const createUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        firstName: { type:  new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
    })
});
