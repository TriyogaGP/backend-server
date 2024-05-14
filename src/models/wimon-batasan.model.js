'use strict';

const WimonBatasanScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idTitik: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_titik'
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
    batas: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'batas',
    },
  };
};

module.exports = {
  WimonBatasanScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const WimonBatasan = sequelizeInstance
      .define(
        'WimonBatasan',
        WimonBatasanScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_wimon_batasan',
          modelName: 'WimonBatasan',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return WimonBatasan;
  },
};
