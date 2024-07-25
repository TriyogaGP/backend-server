'use strict';

const SandiSensorScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idSensor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_sensor'
    },
    ph: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'ph',
    },
    tds: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'tds',
    },
  };
};

module.exports = {
  SandiSensorScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const SandiSensor = sequelizeInstance
      .define(
        'SandiSensor',
        SandiSensorScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_sandi_sensor',
          modelName: 'SandiSensor',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return SandiSensor;
  },
};
