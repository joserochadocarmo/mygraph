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
import {orderByType} from './customTypes/orderByType';
import {whereType} from './customTypes/whereType';
import {Query} from './model';
import {tables} from './mapping';
import myCache from './cache';

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
      alunos: {
        type: new GraphQLList(AlunoType),
        args: {
          limit: {
            type: GraphQLInt
          },
          offset: {
              type: GraphQLInt
          },
          orderBy: {
              description: 'Ex: orderBy:[{column:"nome",direction:DESC}]',
              type: new GraphQLList(orderByType)
          }
        },
        resolve (curso) {
          return Query.getAll(tables.Aluno,{[tables.Curso.idAttribute]: curso.id_curso});
        }
      },
      count: {
        args: {
          column: {
            description: 'Informe a coluna a ser contada - Ex: column:"cpf"',
            type: GraphQLString
          }
        },
        type: GraphQLInt,
        resolve (aluno,args,ast) {
          return Query.count(tables.Curso,args)
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
      curso: {
        type: CursoType,
        args: {
          limit: {
            type: GraphQLInt
          },
          offset: {
              type: GraphQLInt
          },
          orderBy: {
              description: 'Ex: orderBy:[{column:"nome",direction:DESC}]',
              type: new GraphQLList(orderByType)
          }
        },
        resolve (aluno) {
          return Query.get(tables.Curso,{[tables.Curso.idAttribute]: aluno.id_curso});
        }
      },
      pessoa: {
        type: PessoaType,
        args: {
          limit: {
            type: GraphQLInt
          },
          offset: {
              type: GraphQLInt
          },
          orderBy: {
              description: 'Ex: orderBy:[{column:"nome",direction:DESC}]',
              type: new GraphQLList(orderByType)
          }
        },
        resolve (aluno) {
          return Query.get(tables.Pessoa,{[tables.Pessoa.idAttribute]: aluno.id_pessoa});
        }
      },
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
          return Query.count(tables.Aluno,args)
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
      aluno: {
        type: new GraphQLList(AlunoType),
        resolve (pessoa) {
          return Query.getAll(tables.Aluno,{[tables.Pessoa.idAttribute]: pessoa.id_pessoa});
        }
      },
      count: {
        args: {
          column: {
            description: 'Informe a coluna a ser contada - Ex: column:"cpf"',
            type: GraphQLString
          }
        },
        type: GraphQLInt,
        resolve (aluno,args,ast) {
          // return Query.count(tables.Pessoa,args);
          // console.log(ast.operation.loc.source.body);
          let countValueCache = myCache.get(ast.operation.loc.source.body);
          if(countValueCache==undefined){
            return Query.count(tables.Pessoa,args).then(value=>{
              myCache.set(ast.operation.loc.source.body, value);
              console.log("setcache"+ myCache);
              return value;
            });
          }
          console.log("getcache");
          return countValueCache;
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
        args: {
          idPessoa: {
            type: GraphQLInt
          },
          cpfCnpj: {
            type: GraphQLInt
          },
          limit: {
            type: GraphQLInt
          },
          offset: {
              type: GraphQLInt
          },
          orderBy: {
              description: 'Ex: orderBy:[{column:"nome",direction:DESC}]',
              type: new GraphQLList(orderByType)
          },
          where: {
              description: 'Ex: where:[{column:"nome",operator:"=",value="José Pereira"}]',
              type: new GraphQLList(whereType)
          }
        },
        resolve (root, args, ast) {
          return Query.getAll(tables.Pessoa,args);
        }
      },
      alunos: {
        args: {
          matricula: {
            type: GraphQLInt
          },
          anoIngresso: {
            type: GraphQLInt
          },
          limit: {
            type: GraphQLInt
          },
          offset: {
              type: GraphQLInt
          },
          orderBy: {
              description: 'Ex: orderBy:[{column:"nome",direction:DESC}]',
              type: new GraphQLList(orderByType)
          }
        },
        type: new GraphQLList(AlunoType),
        resolve (root, args) {
          return Query.getAll(tables.Aluno,args);
        }
      },
      cursos: {
        args: {
          idCurso: {
            type: GraphQLInt
          },
          limit: {
            type: GraphQLInt
          },
          offset: {
              type: GraphQLInt
          },
          orderBy: {
              description: 'Ex: orderBy:[{column:"nome",direction:DESC}]',
              type: new GraphQLList(orderByType)
          }
        },
        type: new GraphQLList(CursoType),
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
