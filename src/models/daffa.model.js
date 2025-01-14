'use strict';

const DaffaScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idSensor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_sensor'
    },
    tetesan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'tetesan',
    },
    batas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'batas',
    },
    prediksi: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'prediksi',
    },
  };
};

module.exports = {
  DaffaScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Daffa = sequelizeInstance
      .define(
        'Daffa',
        DaffaScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_daffa',
          modelName: 'Daffa',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return Daffa;
  },
};
