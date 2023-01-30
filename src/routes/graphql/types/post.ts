import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql/type';
import { userType } from './user';

export const postType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Post',
    description: 'Simple post',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID'
        },
        user: {
            type: userType,
            description: 'Post author',
            resolve: async (source, _args, context, _info) => {
                return await context.db.user.findOne({ key: 'id', equals: source.userId });
            }
        },
        title: {
            type: GraphQLString,
            description: 'Title'
        },
        content: {
            type: GraphQLString,
            description: 'Content'
        }
    })
});
