import Knex from 'knex';

const connection = Knex({
  client: 'pg',
  connection: {
    host     : '',
    user     : '',
    password : '',
    database : ''
  },
  pool: {
    min: 0,
    max: 5
  },
  debug: true
});

export default connection;
