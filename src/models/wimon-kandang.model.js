'use strict';

const WimonKandangScheme = Sequelize => {
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
    pulseHeart: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'pulse_heart',
    },
    mq135: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'mq135',
    },
  };
};

module.exports = {
  WimonKandangScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const WimonKandang = sequelizeInstance
      .define(
        'WimonKandang',
        WimonKandangScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_wimon_kandang',
          modelName: 'WimonKandang',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return WimonKandang;
  },
};
