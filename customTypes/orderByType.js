import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType
} from 'graphql';

var directionType = new GraphQLEnumType({
    name: 'DirectionType',
    description: 'Diferentes tipos de ordenação',
    values: {
      ASC: {
        description: 'Ordem crescente',
        value: 'ASC'
      },
      DESC: {
        description: 'Ordem decrescente',
        value: 'DESC'
      }
    }
});

var orderByType = new GraphQLInputObjectType({
  name: 'order_',
  description: 'Objeto para definir uma LISTA de coluna(s) a serem ordenadas na listagem: \n - Ex: orderBy:[{column:"nome",direction:DESC}]',
  fields: {
    column: {
      description: 'Informe a coluna a ser ordenada - Ex: column:"nome"',
      type: new GraphQLNonNull(GraphQLString)
    },
    direction: {
      description: 'Informe a direção da ordenação - crescente ou decrescente',
      type: directionType
    }
  }
});

export {orderByType}
