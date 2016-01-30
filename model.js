import db from './knex';
import _ from 'lodash';

function limit(args) {
  return db.limit(args.limit || 25).offset(args.offset || 0);
}

function orderBy(args) {
  let order;
  _.isEmpty(args.orderBy)? _.defaults(args.orderBy, [{'column':table.idAttribute}]):'';
  _.forEach(args.orderBy || [{'column':table.idAttribute}],function(orderType) {
    order = limit(args).orderBy(_.snakeCase(orderType.column) || [table.idAttribute],orderType.direction);
  })
  return order;
}

function where(args) {
  let where = _.isEmpty(args.orderBy) ? limit(args) : orderBy(args);
  let clauses = _.omit(args,'limit','offset','orderBy','where');

  _.forEach(clauses,function(value, key) {
    if(_.isEmpty(args.where)) args.where=[];
    args.where.push({'column':_.snakeCase(key),'operator':'=','value':value});
  });

  _.forEach(args.where, function(clause) {
    let operator = clause.operator;
    if(operator != 'BETWEEN' && operator != 'IN')
      clause.value = clause.value.toString();
    where = where.where(_.snakeCase(clause.column), operator , clause.value);
  });
  return where;
}

/**
Retorna uma listagem
**/
function from(table,args) {
  return where(args).from(table.tableName);
}
/**
Retorna um unico registro
**/
function first(tableName,args) {
  return from(tableName,args).first();
}

function all(tableName,args) {
  return from(tableName,args).select();
}

const Query = ({
  getAll: function(table,args) {
    return all(table,args);
  },
  get: function(table,args) {
    return first(table,args);
  },
  //TODO fazer o count
  count: function() {
    //return db('alunos').where({classroom_id: this.get('id')}).count('id').then((total) => total[0].count)
  }
});
export {Query};
