import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql/type';
import { userType } from './user';
import { memberType } from './member-type';

export const profileType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Profile',
    description: 'Extended user data',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID'
        },
        user: {
            type: userType,
            description: 'Profile owner',
            resolve: async (source, _args, context, _info) => {
                return await context.db.posts.findOne({ key: 'id', equals: source.userId });
            }
        },
        memberType: {
            type: memberType,
            description: 'Post author',
            resolve: async (source, _args, context, _info) => {
                return await context.db.profiles.findOne({ key: 'id', equals: source.memberTypeId });
            }
        },
        avatar: {
            type: GraphQLString,
            description: 'Avatar'
        },
        sex: {
            type: GraphQLString,
            description: 'Sex'
        },
        birthday: {
            type: GraphQLInt,
            description: 'Birthday'
        },
        country: {
            type: GraphQLString,
            description: 'Country'
        },
        street: {
            type: GraphQLString,
            description: 'Country'
        },
        city: {
            type: GraphQLString,
            description: 'Country'
        }
    })
});
