import Knex from 'knex';

const connection = Knex({
  //client: 'pg',
  client:'sqlite3',
  connection: {
    filename: "../development.sqlite3",
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
