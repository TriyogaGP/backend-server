'use strict';

const WimonTitikScheme = Sequelize => {
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
    longitude: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'longitude',
    },
    latitude: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'latitude',
    },
  };
};

module.exports = {
  WimonTitikScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const WimonTitik = sequelizeInstance
      .define(
        'WimonTitik',
        WimonTitikScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_wimon_titik',
          modelName: 'WimonTitik',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return WimonTitik;
  },
};
