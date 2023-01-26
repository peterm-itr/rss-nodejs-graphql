import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { BadRequest, NotFound } from '../../utils/errors';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (_request, _reply): Promise<UserEntity[]> {
      return await this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<UserEntity> {
        const user = await this.db.users.findOne({ key: 'id', equals: request.params.id });

        if (!user) {
            throw new NotFound();
        }

        return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, _reply): Promise<UserEntity> {
        return await this.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<UserEntity> {
        try {
            const deletedUser = await this.db.users.delete(request.params.id);

            (await this.db.posts.findMany({ key: 'userId', equals: deletedUser.id })).forEach((post) => this.db.posts.delete(post.id));
            (await this.db.profiles.findMany({ key: 'userId', equals: deletedUser.id })).forEach((profile) => this.db.profiles.delete(profile.id));
            (await this.db.users.findMany({ key: 'subscribedToUserIds', inArray: deletedUser.id })).forEach((subscriber) => {
                subscriber.subscribedToUserIds.splice(subscriber.subscribedToUserIds.indexOf(deletedUser.id, 1));
                this.db.users.change(subscriber.id, subscriber);
            });

            return deletedUser;
        } catch (e: unknown) {
            throw new BadRequest('User delete failed', { cause: e });
        }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<UserEntity> {
        const [subscribeTo, subscriber] = await Promise.all([
            this.db.users.findOne({ key: 'id', equals: request.params.id }),
            this.db.users.findOne({ key: 'id', equals: request.body.userId })
        ]);

        if (!subscriber || !subscribeTo) {
            throw new BadRequest();
        }

        if (!subscriber.subscribedToUserIds.includes(subscribeTo.id)) {
            subscriber.subscribedToUserIds.push(subscribeTo.id);
        }

        this.db.users.change(subscriber.id, subscriber);

        return subscriber;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<UserEntity> {
        const [unsubscribeFrom, subscriber] = await Promise.all([
            this.db.users.findOne({ key: 'id', equals: request.params.id }),
            this.db.users.findOne({ key: 'id', equals: request.body.userId })
        ]);

        if (!subscriber || !unsubscribeFrom) {
            throw new BadRequest('User does not exist');
        }

        if (!subscriber.subscribedToUserIds.includes(unsubscribeFrom.id)) {
            throw new BadRequest('User is not subscribed');
        }

        const unsubscribeIdx = subscriber.subscribedToUserIds.indexOf(unsubscribeFrom.id);

        subscriber.subscribedToUserIds.splice(unsubscribeIdx, 1);

        this.db.users.change(subscriber.id, subscriber);

        return subscriber;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<UserEntity> {
        try {
            return await this.db.users.change(
                request.params.id,
                request.body
            );
        } catch (e: unknown) {
            throw new BadRequest('Patch user failed', { cause: e });
        }
    }
  );
};

export default plugin;
