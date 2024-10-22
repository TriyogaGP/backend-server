'use strict';

const TitikPemantauanScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idTitik: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_titik'
    },
    latitude: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'latitude',
    },
    longitude: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'longitude',
    },
  };
};

module.exports = {
  TitikPemantauanScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const TitikPemantauan = sequelizeInstance
      .define(
        'TitikPemantauan',
        TitikPemantauanScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_titik_pemantauan',
          modelName: 'TitikPemantauan',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    return TitikPemantauan;
  },
};
