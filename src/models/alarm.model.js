'use strict';

const AlarmScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idAlarm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_alarm'
    },
    waktu: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'waktu',
    },
    hari: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'hari',
    },
  };
};

module.exports = {
  AlarmScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Alarm = sequelizeInstance
      .define(
        'Alarm',
        AlarmScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_alarm',
          modelName: 'Alarm',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return Alarm;
  },
};
