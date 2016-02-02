import Knex from 'knex';

const connection = Knex({
  client: 'pg',
  connection: {
    host     : '200.137.217.50',
    user     : 'sigaa',
    password : 'sigaa',
    database : 'treinamento_sigaa_201601032000'
  },
  pool: {
    min: 0,
    max: 5
  },
  debug: true
});

export default connection;
