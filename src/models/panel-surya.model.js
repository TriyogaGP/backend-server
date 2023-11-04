'use strict';

const PanelSuryaScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idSensor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_sensor'
    },
    tegangan: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'tegangan',
    },
    arus: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'arus',
    },
    daya: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'daya',
    },
    kwh: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'kwh',
    },
    suhu: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'suhu',
    },
  };
};

module.exports = {
  PanelSuryaScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const PanelSurya = sequelizeInstance
      .define(
        'PanelSurya',
        PanelSuryaScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_panel_surya',
          modelName: 'PanelSurya',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return PanelSurya;
  },
};
