'use strict';

const AlyaHidroponikScheme = Sequelize => {
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
  AlyaHidroponikScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const AlyaHidroponik = sequelizeInstance
      .define(
        'AlyaHidroponik',
        AlyaHidroponikScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_alya_hidroponik',
          modelName: 'AlyaHidroponik',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return AlyaHidroponik;
  },
};
