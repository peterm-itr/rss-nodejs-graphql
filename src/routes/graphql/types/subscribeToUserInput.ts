import { GraphQLInputObjectType, GraphQLID } from 'graphql';

export const subscribeToUserInput = new GraphQLInputObjectType({
    name: 'SubscribeToUserInput',
    fields: () => ({
        userId: { type: GraphQLID },
        subscribeToUserId: { type: GraphQLID },
    })
});
