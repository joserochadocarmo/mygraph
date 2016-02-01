import db from './knex';
import _ from 'lodash';

function limit(_sql,args) {
  return _sql.limit(args.limit || 25).offset(args.offset || 0);
}

function orderBy(_sql,table,args) {
  _.isEmpty(args.orderBy)? _.defaults(args.orderBy, [{'column':table.idAttribute}]):'';
  _.forEach(args.orderBy || [{'column':table.idAttribute}],(orderType)=> {
    _sql.orderBy(_.snakeCase(orderType.column) || [table.idAttribute],orderType.direction);
  })
  return _sql;
}

function where(_sql,args) {
  let clauses = _.omit(args,'limit','offset','orderBy','where','select');

  _.forEach(clauses,(value, key)=>{
    if(_.isEmpty(args.where)) args.where=[];
    args.where.push({'column':_.snakeCase(key),'operator':'=','value':value});
  });

  _.forEach(args.where, (clause)=>{
    let operator = clause.operator;
    if(operator != 'BETWEEN' && operator != 'IN')
      clause.value = clause.value==undefined ? clause.value : clause.value.toString();
    _sql.where(_.snakeCase(clause.column), operator , clause.value);
  });
  return _sql;
}

/**
Retorna uma listagem
**/
function from(_sql,table) {
  return _sql.from(table.tableName);
}
/**
Retorna um unico registro
**/
function first(table,args) {
  return from(where(orderBy(limit(db,args),table,args),args),table).first( _.map(args.select,_.snakeCase));
}

function all(table,args) {
  return from(where(orderBy(limit(db,args),table,args),args),table).select(_.map(args.select,_.snakeCase));
}

function count(table,args) {
  return from(where(db,args),table).first().count(args.column || "* as count").then(value=>{
    return value.count}
  );
}

const Query = ({
  getAll: (table,args) =>{
    return all(table,args);
  },
  get: (table,args) =>{
    return first(table,args);
  },
  count
});
export {Query};
