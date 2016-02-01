import Express from 'express';
import GraphHTTP from 'express-graphql';
// import Schema from './schema-sequelize.js';
import Schema from './schema-knex.js';

// Start
const app = Express();

app.use('/', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

let server = app.listen(3000, ()=> {
  console.log(`✔ Express GraphQL running on http://localhost:${server.address().port}`);
});
