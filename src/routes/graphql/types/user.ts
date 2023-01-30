import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { postType } from './post';
import { profileType } from './profile';

export const userType: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    description: 'Basic user information',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'ID'
        },
        email: {
            type: GraphQLString,
            description: 'Email'
        },
        firstName: {
            type: GraphQLString,
            description: 'First name'
        },
        lastName: {
            type: GraphQLString,
            description: 'Last Name'
        },
        subscribedToUsers: {
            type: new GraphQLList(userType),
            description: 'List of users curren user is subscribed to',
            resolve: async (src: UserEntity, _args, context, _info) => {
                return context.userLoader.loadMany(src.subscribedToUserIds);
            }
        },
        usersSubscribedTo: {
            type: new GraphQLList(userType),
            description: 'List of users who are subscribed to current user',
            resolve: async (src: UserEntity, _args, context, _info) => {
                return await context.db.users.findMany({ key: 'subscribedToUserIds', inArray: src.id });
            }
        },
        posts: {
            type: new GraphQLList(postType),
            description: 'List of user\'s posts',
            resolve: async (src: UserEntity, _args, context, _info) => {
                return await context.db.posts.findMany({ key: 'userId', equals: src.id });
            }
        },
        profile: {
            type: profileType,
            description: 'Extended user profile',
            resolve: async (src: UserEntity, _args, context, _info) => {
                return await context.db.profiles.findOne({ key: 'userId', equals: src.id });
            }
        }
    })
});
