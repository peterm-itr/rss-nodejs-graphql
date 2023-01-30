import { GraphQLID, GraphQLObjectType } from 'graphql/type';
import { userType } from './user';
import { createUserInput } from './createUserInput';
import { updateUserInput } from './updateUserInput';
import { BadRequest } from '../../../utils/errors';
import { profileType } from './profile';
import { createProfileInput } from './createProfileInput';
import { updateProfileInput } from './updateProfileInput';
import { memberType } from './member-type';
import { updateMemberTypeInput } from './updateMemberTypeInput';
import { postType } from './post';
import { createPostInput } from './createPostInput';
import { updatePostInput } from './updatePostInput';
import { subscribeToUserInput } from './subscribeToUserInput';
import { unsubscribeFromUserInput } from './unsubscribeFromUserInput';

export const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createUser: {
            type: userType,
            args: {
                user: {
                    type: createUserInput
                }
            },
            resolve: async (_src, args, context, _info) => {
                return await context.db.users.create(args.user);
            }
        },
        updateUser: {
            type: userType,
            args: {
                user: {
                    type: updateUserInput
                },
                id: {
                    type: GraphQLID
                }
            },
            resolve: async (_src, args, context, _info) => {
                const user = await context.db.users.findOne({ key: 'id', equals: args.id });

                if (!user) {
                    throw new BadRequest('User does not exist');
                }

                return await context.db.users.change(args.id, args.user);
            }
        },
        subscribeToUser: {
            type: userType,
            args: {
                sub: {
                    type: subscribeToUserInput
                }
            },
            resolve: async (_src, args, context, _info) => {
                const user = await context.db.users.findOne({ key: 'id', equals: args.sub.userId });

                if (!user || user.subscribedToUserIds.includes(args.sub.subscribeToUserId)) {
                    throw new BadRequest('User does not exist or is already subscribed');
                }

                const subscribeToUser = await context.db.users.findOne({ key: 'id', equals: args.sub.subscribeToUserId });

                if (!subscribeToUser) {
                    throw new BadRequest('User to subscribe to does not exist');
                }

                user.subscribedToUserIds.push(subscribeToUser.id);

                return await context.db.users.change(user.id, user);
            }
        },
        unsubscribeFromUser: {
            type: userType,
            args: {
                sub: {
                    type: unsubscribeFromUserInput
                }
            },
            resolve: async (_src, args, context, _info) => {
                const user = await context.db.users.findOne({ key: 'id', equals: args.sub.userId });

                if (!user || !user.subscribedToUserIds.includes(args.sub.unsubscribeFromUserId)) {
                    throw new BadRequest('User does not exist or is not subscribed');
                }

                user.subscribedToUserIds.splice(user.subscribedToUserIds.indexOf(args.sub.unsubscribeFromUserId), 1);

                return await context.db.users.change(user.id, user);
            }
        },
        createProfile: {
            type: profileType,
            args: {
                profile: {
                    type: createProfileInput
                }
            },
            resolve: async (_src, args, context, _info) => {
                const user = await context.db.users.findOne({ key: 'id', equals: args.profile.userId });

                if (!user) {
                    throw new BadRequest('User does not exist');
                }

                const profile = await context.db.profiles.findOne({ key: 'userId', equals: user.id });

                if (profile) {
                    throw new BadRequest('Profile already exists');
                }

                const memberType = await context.db.memberTypes.findOne({ key: 'id', equals: args.profile.memberTypeId });

                if (!memberType) {
                    throw new BadRequest('Member type does not exist');
                }

                return await context.db.profiles.create(args.profile);
            }
        },
        updateProfile: {
            type: profileType,
            args: {
                profile: {
                    type: updateProfileInput
                },
                id: {
                    type: GraphQLID
                }
            },
            resolve: async (_src, args, context, _info) => {
                const profile = await context.db.profiles.findOne({ key: 'id', equals: args.id });

                if (!profile) {
                    throw new BadRequest('Profile does not exist');
                }

                const memberType = await context.db.memberTypes.findOne({ key: 'id', equals: args.profile.memberTypeId });

                if (args.profile.memberTypeId && !memberType) {
                    throw new BadRequest('Member type does not exist');
                }

                return await context.db.profiles.change(args.id, args.profile);
            }
        },
        updateMemberType: {
            type: memberType,
            args: {
                memberType: {
                    type: updateMemberTypeInput
                },
                id: {
                    type: GraphQLID
                }
            },
            resolve: async (_src, args, context, _info) => {
                const memberType = await context.db.memberTypes.findOne({ key: 'id', equals: args.id });

                if (!memberType) {
                    throw new BadRequest('Member type does not exist');
                }

                return await context.db.memberTypes.change(args.id, args.memberType);
            }
        },
        createPost: {
            type: postType,
            args: {
                post: {
                    type: createPostInput
                }
            },
            resolve: async (_src, args, context, _info) => {
                const user = await context.db.users.findOne({ key: 'id', equals: args.post.userId });

                if (!user) {
                    throw new BadRequest('User does not exist');
                }

                return await context.db.posts.create(args.post);
            }
        },
        updatePost: {
            type: postType,
            args: {
                post: {
                    type: updatePostInput
                },
                id: {
                    type: GraphQLID
                }
            },
            resolve: async (_src, args, context, _info) => {
                const post = await context.db.posts.findOne({ key: 'id', equals: args.id });

                if (!post) {
                    throw new BadRequest('Post does not exist');
                }

                return await context.db.posts.change(args.id, args.post);
            }
        }
    })
});
