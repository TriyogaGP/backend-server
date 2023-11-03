const { encrypt, decrypt, makeRandom, convertDateTime } = require('./helper.utils');
const { Op } = require('sequelize')
const { sequelizeInstance, Sequelize } = require('../configs/db.config');
const { importModels } = require('../models/index')
const models = importModels(sequelizeInstance, Sequelize);

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const getDataPanelSurya = async () => {
	const getData = await models.PanelSUrya.findOne({where: { idSensor: 1 }})
  if(getData){
		return getData.dataValues
  }else{
    return null
  }
};


module.exports = {
  getDataPanelSurya,
};