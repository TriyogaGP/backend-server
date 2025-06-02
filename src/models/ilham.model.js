'use strict';

const IlhamScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idSensor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_sensor'
    },
    isiAir: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'isi_air',
    },
    kurasAir: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'kuras_air',
    },
  };
};

module.exports = {
  IlhamScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Ilham = sequelizeInstance
      .define(
        'Ilham',
        IlhamScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_ilham',
          modelName: 'Ilham',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return Ilham;
  },
};
