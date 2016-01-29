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
/**
Retorna uma listagem
**/
function query(table,args) {
  let _sql;
  _sql = _.isEmpty(args.orderBy) ? limit(args) : orderBy(args);

  let clauses = _.omit(args,'limit','offset','orderBy','where');

  _.forEach(clauses,function(value, key) {
    if(_.isEmpty(args.where)) args.where=[];
    args.where.push({'column':_.snakeCase(key),'operator':'=','value':value});
  })

  _.forEach(args.where, function(clause) {
    _sql = _sql.where(_.snakeCase(clause.column),clause.operator,clause.value.toString());
  })

  let from_ = _sql.from(table.tableName);

  return from_;
}
/**
Retorna um unico registro
**/
function first(tableName,args) {
  return  query(tableName,args).first();
}

function all(tableName,args) {
  return  query(tableName,args).select();
}

const Pessoa = ({
  tableName: 'comum.pessoa',
  idAttribute: 'id_pessoa',
  get: function(args) {
    return all(this,args);
  },
  getAlunos: function(args) {
    return all(Aluno,args);
  },
  alunosCount: function() {
    //return db('alunos').where({classroom_id: this.get('id')}).count('id').then((total) => total[0].count)
  }
});

const Aluno = ({
  tableName: 'public.discente',
  idAttribute: 'id_discente',
  get: function(args) {
    return all(this,args);
  },
  getPessoa: function(args) {
    return first(Pessoa,args);
  },
  getCurso: function(args) {
    return first(Curso,args);
  }
});

const Curso = ({
  tableName: 'public.curso',
  idAttribute: 'id_curso',
  get: function(args) {
    return all(this,args);
  },
  getAlunos: function(args) {
    return all(Aluno,args);
  }
});

export {Pessoa, Curso, Aluno};
