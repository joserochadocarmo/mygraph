import Sequelize from 'sequelize';
import _ from 'lodash';

const Conn = new Sequelize(
  'treinamento_sigaa_201601032000',
  'sigaa',
  'sigaa', {
    dialect: 'postgres',
    host: '200.137.217.50',
    pool: {
      maxConnections: 5,
      maxIdleTime: 30
    },
    logging: false
  }
);

const Pessoa = Conn.define('pessoa', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    field: "id_pessoa",
    allowNull: false
  },
  nome: {
    type: Sequelize.STRING
  },
  sexo: {
    type: Sequelize.STRING
  },
  cpf: {
    type: Sequelize.INTEGER,
    field: "cpf_cnpj"
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  telefoneFixo: {
    type: Sequelize.STRING,
    field: "telefone_fixo"
  },
  telefoneCelular: {
    type: Sequelize.STRING,
    field: "telefone_celular"
  }
}, {
  timestamps: false,
  schema: "comum",
  tableName: 'pessoa'
});

const Aluno = Conn.define('aluno', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    field: "id_discente",
    allowNull: false
  },
  ano_ingresso: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  matricula: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  schema: "public",
  tableName: 'discente'
});

const Curso = Conn.define('curso', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    field: "id_curso",
    allowNull: false
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'curso'
});

// Relations
Pessoa.hasMany(Aluno, {
  foreignKey: 'id_pessoa'
});
Aluno.belongsTo(Pessoa, {
  foreignKey: 'id_pessoa'
});
Aluno.belongsTo(Curso, {
  foreignKey: 'id_curso'
});
Curso.hasMany(Aluno, {
  foreignKey: 'id_curso',
  targetKey: 'id_curso'
});

export default Conn;
