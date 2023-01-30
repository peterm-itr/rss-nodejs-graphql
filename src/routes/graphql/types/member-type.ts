import { GraphQLID, GraphQLInt, GraphQLObjectType } from 'graphql/type';

export const memberType: GraphQLObjectType = new GraphQLObjectType({
    name: 'MemberType',
    description: 'Membership type',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID'
        },
        discount: {
            type: GraphQLInt,
            description: 'Discount size'
        },
        monthPostsLimit: {
            type: GraphQLInt,
            description: 'Allowed posts per month'
        }
    })
});
