import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { schema } from './types/schema';
import { ApiError } from '../../utils/errors';
import { graphql } from 'graphql/graphql';
import { validate } from 'graphql/validation';
import { DocumentNode, parse, Source } from 'graphql/language';
import * as depthLimit from 'graphql-depth-limit';
import * as DataLoader from 'dataloader';
import { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (_request, _reply) {
        const userLoader = new DataLoader(async (keys: readonly string[]) => {
            const users = await fastify.db.users.findMany({ key: 'id', equalsAnyOf: keys as string[] });
            const map = new Map<string, UserEntity>(users.map((user) => [user.id, user]));

            return keys.map((key) => map.get(key));
        });

        let documentAst: DocumentNode;
        const gqlSource = new Source(_request.body.mutation ?? _request.body.query);

        try {
            documentAst = parse(gqlSource);
        } catch (e) {
            throw new ApiError('Query parser failed', { cause: e });
        }

        const errors = validate(schema, documentAst, [depthLimit(4)]);

        if (errors.length > 0) {
            return { errors: errors };
        }

        return await graphql({
            schema: schema,
            source: gqlSource,
            variableValues: _request.body.variables,
            contextValue: { db: fastify.db, userLoader: userLoader }
        });
    }
  );
};

export default plugin;
