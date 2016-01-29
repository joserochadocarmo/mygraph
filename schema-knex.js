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
import {Curso,Aluno,Pessoa} from './model';

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
        resolve (curso,args) {
          args[Curso.idAttribute]=curso.id_curso;
          return Curso.getAlunos(args);
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
        resolve (aluno,args) {
          args[Curso.idAttribute]=aluno.id_curso
          return Aluno.getCurso(args);
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
        resolve (aluno,args) {
          args[Pessoa.idAttribute]=aluno.id_pessoa;
          return Aluno.getPessoa(args)
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
          return Pessoa.getAlunos({[Pessoa.idAttribute]: pessoa.id_pessoa});
        }
      }
    };
  }
});

const Query = new GraphQLObjectType({
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
          email: {
            type: GraphQLString
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
          return Pessoa.get(args);
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
          return Aluno.get(args);
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
          return Curso.get(args);
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
  query: Query,
  mutation: Mutation
});

export default Schema;
