import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql/type';
import { userType } from './user';
import { postType } from './post';
import { profileType } from './profile';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { memberType } from './member-type';

export const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        users: {
            type: new GraphQLList(userType),
            description: 'List of all users',
            resolve: async (_source, _args, context, _info) => {
                const allUsers = await context.db.users.findMany();

                allUsers.forEach((user: UserEntity) => context.userLoader.prime(user.id, user));

                return allUsers;
            }
        },
        user: {
            type: userType,
            description: 'Single user by ID',
            args: {
                id: {
                    type: GraphQLID,
                    description: 'ID of the user to fetch'
                }
            },
            resolve: async (_source, args, context, _info) => {
                return context.userLoader.load(args.id);
            }
        },
        posts: {
            type: new GraphQLList(postType),
            description: 'All posts',
            resolve: async (_source, _args, context, _info) => {
                return await context.db.posts.findMany();
            }
        },
        post: {
            type: postType,
            args: {
                id: {
                    type: GraphQLID,
                    description: 'ID of the post to fetch'
                }
            },
            resolve: async (_source, args, context, _info) => {
                return await context.db.users.findOne({ key: 'id', equals: args.id })
            }
        },
        profiles: {
            type: new GraphQLList(profileType),
            description: 'All profiles',
            resolve: async (_source, _args, context, _info) => {
                return await context.db.profiles.findMany();
            }
        },
        profile: {
            type: profileType,
            args: {
                id: {
                    type: GraphQLID,
                    description: 'ID of the profile to fetch'
                }
            },
            resolve: async (_source, args, context, _info) => {
                return await context.db.profiles.findOne({ key: 'id', equals: args.id })
            }
        },
        memberTypes: {
            type: new GraphQLList(memberType),
            description: 'All member types',
            resolve: async (_source, _args, context, _info) => {
                return await context.db.memberTypes.findMany();
            }
        },
        memberType: {
            type: memberType,
            args: {
                id: {
                    type: GraphQLID,
                    description: 'ID of the member type to fetch'
                }
            },
            resolve: async (_source, args, context, _info) => {
                return await context.db.memberTypes.findOne({ key: 'id', equals: args.id })
            }
        },
    })
});
