'use strict';

const SensorTestingScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idSensor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_sensor'
    },
    sensor1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sensor1',
    },
    sensor2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sensor2',
    },
    sensor3: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sensor3',
    },
  };
};

module.exports = {
  SensorTestingScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const SensorTesting = sequelizeInstance
      .define(
        'SensorTesting',
        SensorTestingScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_sensor_testing',
          modelName: 'SensorTesting',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return SensorTesting;
  },
};
