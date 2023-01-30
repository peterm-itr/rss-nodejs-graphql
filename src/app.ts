import { join } from 'path';
import AutoLoad from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';

const app: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: {},
  });

  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: {},
  });

  fastify.setErrorHandler((error, _req, res) => {
      if (error.statusCode) {
          if (error.statusCode > 400) {
              _req.log.error(error);
          }

          res
              .code(error.statusCode)
              .send(error);
      } else {
          _req.log.error(error);

          res
              .code(500)
              .send({ error: 'Internal Server Error' });
      }
  });
};

export default app;
