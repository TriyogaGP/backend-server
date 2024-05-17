'use strict';

const SmartCoolerScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idSensor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_sensor'
    },
    suhu: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'suhu',
    },
    humidity: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'humidity',
    },
    tegangan: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'tegangan',
    },
  };
};

module.exports = {
  SmartCoolerScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const SmartCooler = sequelizeInstance
      .define(
        'SmartCooler',
        SmartCoolerScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_smart_cooler',
          modelName: 'SmartCooler',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return SmartCooler;
  },
};
