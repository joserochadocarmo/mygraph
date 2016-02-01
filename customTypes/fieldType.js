import {
  GraphQLString,
  GraphQLInt
} from 'graphql';
import {Query} from '../model';

module.exports = {
  fields: {
    count: {
      args: {
        column: {
          description: 'Informe a coluna a ser contada - Ex: column:"cpf"',
          type: GraphQLString
        }
      },
      type: GraphQLInt,
      resolve (aluno,args,ast) {
        console.log(ast);
        return Query.count(tables.Curso,args)
      }
    }
  }
};
