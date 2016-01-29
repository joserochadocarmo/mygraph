import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType
} from 'graphql';

var filterType = new GraphQLEnumType({
    name: 'FilterType',
    description: 'Different filter types',
    values: {
      AND: {
        value: 'AND'
      },
      OR: {
        value: 'OR'
      },
      NOT: {
        value: 'NOT'
      }
    }
});

var operatorType = new GraphQLEnumType({
    name: 'OperatorType',
    description: 'Diferentes tipos de operaçoes',
    values: {
      EQUAL: {
        description: 'Igual',
        value: '='
      },
      NOT_EQUAL: {
        description: 'Diferente',
        value: '<>'
      },
      LESS_THAN: {
        description: 'Menor que',
        value: '<'
      },
      GREATER_THAN: {
        description: 'Maior que',
        value: '>'
      },
      LESS_THAN_OR_EQUAL: {
        description: 'Menor ou igual',
        value: '<='
      },
      GREATER_THAN_OR_EQUAL: {
        description: 'Maior ou igual',
        value: '>='
      },
      BETWEEN: {
        description: 'Entre um intervalo inclusivo',
        value: 'BETWEEN'
      },
      LIKE: {
        description: 'Procura por um padrão',
        value: 'LIKE'
      },
      IN: {
        description: 'Diferente',
        value: 'IN'
      }
    }
});

var whereType = new GraphQLInputObjectType({
  name: 'where_',
  description: 'Objeto para definir as condições da busca: \n - Ex: where:[{column:"nome",operator:"=",value="José Pereira"}]',
  fields: {
    column: {
      description: 'Informe a coluna a ser usada na condição - Ex: column:"nome"',
      type: new GraphQLNonNull(GraphQLString)
    },
    operator: {
      description: 'Informe o operador da condição',
      type: new GraphQLNonNull(operatorType)
    },
    value: {
      description: 'Informe o valor da condição',
      type: new GraphQLList(GraphQLString)
    }
  }
});

export {whereType}
