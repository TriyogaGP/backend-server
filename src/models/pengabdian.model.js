'use strict';

const PengabdianScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idSensor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_sensor'
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'kategori',
    },
    suhu: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'suhu',
    },
    bpm: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'bpm',
    },
  };
};

module.exports = {
  PengabdianScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Pengabdian = sequelizeInstance
      .define(
        'Pengabdian',
        PengabdianScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_sensor_pengabdian',
          modelName: 'Pengabdian',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return Pengabdian;
  },
};
