import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { BadRequest, NotFound } from '../../utils/errors';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (_request, _reply): Promise<PostEntity[]> {
      return await this.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<PostEntity> {
        const post = await this.db.posts.findOne({ key: 'id', equals: request.params.id });

        if (!post) {
            throw new NotFound();
        }

        return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, _reply): Promise<PostEntity> {
        const user = await this.db.users.findOne({ key: 'id', equals: request.body.userId });

        if (!user) {
            throw new BadRequest('User does not exist');
        }

        return await this.db.posts.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<PostEntity> {
        try {
            return await this.db.posts.delete(request.params.id);
        } catch (e: unknown) {
            throw new BadRequest('Delete post failed', { cause: e });
        }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<PostEntity> {
        try {
            return await this.db.posts.change(
                request.params.id,
                request.body
            );
        } catch (e: unknown) {
            throw new BadRequest('Patch post failed', { cause: e });
        }
    }
  );
};

export default plugin;
