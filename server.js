import Express from 'express';
import GraphHTTP from 'express-graphql';
// import Schema from './schema-sequelize.js';
import Schema from './schema-knex.js';

// Config
const APP_PORT = 3000;

// Start
const app = Express();

app.use('/', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(APP_PORT, ()=> {
  console.log(`✔ Express server listening on http://127.0.0.1:${APP_PORT}`);
});
