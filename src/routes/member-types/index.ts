import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { BadRequest, NotFound } from '../../utils/errors';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (_request, _reply): Promise<
    MemberTypeEntity[]
  > {
      return await this.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<MemberTypeEntity> {
        const memberType = await this.db.memberTypes.findOne({ key: 'id', equals: request.params.id });

        if (!memberType) {
            throw new NotFound();
        }

        return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, _reply): Promise<MemberTypeEntity> {
        try {
            return await this.db.memberTypes.change(
                request.params.id,
                request.body
            );
        } catch (e: unknown) {
            throw new BadRequest('Patch Failed', { cause: e });
        }
    }
  );
};

export default plugin;
