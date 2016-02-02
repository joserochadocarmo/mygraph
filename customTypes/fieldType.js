import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';
import {orderByType} from './orderByType';
import {whereType} from './whereType';

module.exports = function () {
  return {
    id: {
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
  };
}
