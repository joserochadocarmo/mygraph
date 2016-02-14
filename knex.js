import Knex from 'knex';

const connection = Knex({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'teste',
    password : 'teste',
    database : 'treinamento'
  },
  pool: {
    min: 0,
    max: 5
  },
  debug: true
});

export default connection;
