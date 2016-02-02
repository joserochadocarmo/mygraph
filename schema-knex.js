import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';
//import {orderByType} from './customTypes/orderByType';
// import {whereType} from './customTypes/whereType';
import getFieldASTs from './customTypes/selectType';
import {Query} from './model';
import {tables} from './mapping';
//import myCache from './cache';
import countType from './customTypes/countType';
import fieldType from './customTypes/fieldType';
import _ from 'lodash';

const CursoType = new GraphQLObjectType({
  name: 'Curso',
  description: 'Isto representa um curso',
  fields: () => {
    return {
      idCurso: {
        type: GraphQLInt,
        resolve (curso) {
            return curso.id_curso;
        }
      },
      nome: {
        type: GraphQLString,
        resolve (curso) {
          return curso.nome;
        }
      },
      count: countType(tables.Curso),
      alunos: {
        type: new GraphQLList(AlunoType),
        args: fieldType(),
        resolve (curso) {
          return Query.getAll(tables.Aluno,{[tables.Curso.idAttribute]: curso.id_curso});
        }
      }
    };
  }
});

const AlunoType = new GraphQLObjectType({
  name: 'Aluno',
  description: 'Isto representa um aluno',
  fields: () =>  {
    return {
      idDiscente: {
        type: GraphQLInt,
        resolve (aluno) {
          return aluno.id_discente;
        }
      },
      idPessoa: {
        type: GraphQLInt,
        resolve (aluno) {
          return aluno.id_pessoa;
        }
      },
      matricula: {
        type: GraphQLInt,
        resolve (aluno) {
          return aluno.matricula;
        }
      },
      anoIngresso: {
        type: GraphQLInt,
        resolve (aluno) {
          return aluno.ano_ingresso;
        }
      },
      count: countType(tables.Aluno),
      curso: {
        type: CursoType,
        args: fieldType(),
        resolve (aluno,args,info) {
          args[tables.Curso.idAttribute]= aluno.id_curso;
          args.select = getFieldASTs(info);
          return Query.get(tables.Curso,args);
        }
      },
      pessoa: {
        type: PessoaType,
        args: fieldType(),
        resolve (aluno,args,info) {
          args[tables.Pessoa.idAttribute]= aluno.id_pessoa;
          args.select = getFieldASTs(info);
          return Query.get(tables.Pessoa,args);
        }
      }
    };
  }
});

const PessoaType = new GraphQLObjectType({
  name: 'Pessoa',
  description: 'Isto representa uma pessoa',
  fields: () => {
    return {
      idPessoa: {
        type: GraphQLInt,
        resolve (pessoa) {
          return pessoa.id_pessoa;
        }
      },
      nome: {
        type: GraphQLString,
        resolve (pessoa) {
          return pessoa.nome;
        }
      },
      sexo: {
        type: GraphQLString,
        resolve (pessoa) {
          return pessoa.sexo;
        }
      },
      cpfCnpj: {
        type: GraphQLFloat,
        resolve (pessoa) {
          return pessoa.cpf_cnpj;
        }
      },
      email: {
        type: GraphQLString,
        resolve (pessoa) {
          return pessoa.email;
        }
      },
      count: countType(tables.Pessoa),
      aluno: {
        type: new GraphQLList(AlunoType),
        args: fieldType(),
        resolve (pessoa,args) {
          args[tables.Pessoa.idAttribute] = pessoa.id_pessoa;
          return Query.getAll(tables.Aluno,args);
        }
      }
    };
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      pessoas: {
        type: new GraphQLList(PessoaType),
        args: _.extend(fieldType(),{
          cpfCnpj: {
            type: GraphQLInt
          }
        }),
        resolve (root, args, ast) {
          return Query.getAll(tables.Pessoa,args);
        }
      },
      alunos: {
        type: new GraphQLList(AlunoType),
        args: _.extend(fieldType(),{
          matricula: {
            type: GraphQLInt
          },
          anoIngresso: {
            type: GraphQLInt
          }
        }),
        resolve (root, args,info) {
          args.select = getFieldASTs(info);
          args.select.push(tables.Pessoa.idAttribute);
          args.select.push(tables.Curso.idAttribute);
          return Query.getAll(tables.Aluno,args);
        }
      },
      cursos: {
        type: new GraphQLList(CursoType),
        args: fieldType(),
        resolve (root, args) {
          return Query.getAll(tables.Curso,args);
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {
      addPessoa: {
        type: PessoaType,
        args: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return Model.models.pessoa.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase()
          });
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

export default Schema;
