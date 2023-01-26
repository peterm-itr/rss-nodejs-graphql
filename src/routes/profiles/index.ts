import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { BadRequest, NotFound } from '../../utils/errors';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (_request, _reply): Promise<
    ProfileEntity[]
  > {
      return await this.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<ProfileEntity> {
        const profile = await this.db.profiles.findOne({ key: 'id', equals: request.params.id });

        if (!profile) {
            throw new NotFound();
        }

        return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, _reply): Promise<ProfileEntity> {
        const [user, memberType, profile] = await Promise.all([
            this.db.users.findOne({ key: 'id', equals: request.body.userId }),
            this.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId }),
            this.db.profiles.findOne({ key: 'userId', equals: request.body.userId })
        ]);

        if (!user || !memberType || profile) {
            throw new BadRequest();
        }

        return await this.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<ProfileEntity> {
        try {
            return await this.db.profiles.delete(request.params.id);
        } catch (e: unknown) {
            throw new BadRequest('delete failed', { cause: e });
        }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<ProfileEntity> {
        try {
            return await this.db.profiles.change(
                request.params.id,
                request.body
            );
        } catch (e: unknown) {
            throw new BadRequest('patch failed', { cause: e });
        }
    }
  );
};

export default plugin;
