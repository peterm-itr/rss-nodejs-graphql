import { GraphQLString, GraphQLInputObjectType } from 'graphql';

export const updateUserInput = new GraphQLInputObjectType({
    name: 'UpdateUserInput',
    fields: () => ({
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
    })
});
