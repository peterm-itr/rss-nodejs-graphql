import { GraphQLInputObjectType, GraphQLInt } from 'graphql';

export const updateMemberTypeInput = new GraphQLInputObjectType({
    name: 'UpdateMemberTypeInput',
    fields: () => ({
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
    })
});
