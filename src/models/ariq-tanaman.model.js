'use strict';

const AriqTanamanScheme = Sequelize => {
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
    kelembaban: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'kelembaban',
    },
    warna: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'warna',
    },
  };
};

module.exports = {
  AriqTanamanScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const AriqTanaman = sequelizeInstance
      .define(
        'AriqTanaman',
        AriqTanamanScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_ariq',
          modelName: 'AriqTanaman',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return AriqTanaman;
  },
};
