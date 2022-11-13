const fastify = require('fastify')({ logger: true })
const cors = require('@fastify/cors')

module.exports = async (routing, port) => {
  try {
    await fastify.register(cors, {
      "origin": 'http://localhost:8000',
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": true,
      "optionsSuccessStatus": 201
    })
    for (const name in routing) {
      const entity = routing[name];
      for (const method in entity) {
        const handler = entity[method];
        fastify.post(`/api/${name}/${method}`, {}, async (request, reply) => {
          reply.headers({
            'X-XSS-Protection': '1; mode=block',
            'X-Content-Type-Options': 'nosniff',
            'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json; charset=UTF-8',
          });
          const { args } = request.body;
          console.log(`in fastify method: ${args} ${request.ip} ${method} /api/${name}/${method}`);
          const result = await handler(...args);
          return result.rows
        });
      }
    }

    await fastify.listen({ port })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}