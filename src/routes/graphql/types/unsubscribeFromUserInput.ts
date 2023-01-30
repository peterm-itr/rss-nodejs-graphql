import { GraphQLInputObjectType, GraphQLID } from 'graphql';

export const unsubscribeFromUserInput = new GraphQLInputObjectType({
    name: 'UnsubscribeFromUserInput',
    fields: () => ({
        userId: { type: GraphQLID },
        unsubscribeFromUserId: { type: GraphQLID },
    })
});
