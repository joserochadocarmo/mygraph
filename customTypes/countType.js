import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';
import {Query} from '../model';
import myCache from '../cache';
module.exports = function (table) {
  return ({
    args: {
      column: {
        description: 'Informe a coluna a ser contada - Ex: column:"cpf"',
        type: GraphQLString
      }
    },
    type: GraphQLInt,
    resolve(aluno, args, ast) {
      let countValueCache = myCache.get(ast.operation.loc.source.body);
      if (countValueCache == undefined) {
        return Query.count(table, args).then(value => {
          myCache.set(ast.operation.loc.source.body, value);
          console.log("setcache" + myCache);
          return value;
        });
      }
      console.log("getcache");
      return countValueCache;
    }
  });
}
