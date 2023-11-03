const { Router } = require('express');
const { verifyToken } = require('../middleware/VerifyToken');
const {
  getServer,
  getServerAlarm,
  getJadwalSholat,
  getTanamanAriq,
  postTanamanAriq,
  postServerPengadian,
  postPanelSurya,
} = require('../controllers/sensorTesting.controller')

module.exports = (models, io) => {
  const route = Router();

  route.route('/testing')
    .get(getServer(models))
  route.route('/alarm')
    .get(getServerAlarm(models))
  route.route('/jadwal-sholat')
    .get(getJadwalSholat(models))
  route.route('/get-ariq-tanaman')
    .get(getTanamanAriq(models))
  route.route('/post-ariq-tanaman')
    .get(postTanamanAriq(models))
    
  route.route('/pengabdian')
    .get(postServerPengadian(models))
  route.route('/panelsurya')
    .get(postPanelSurya(models, io))

  return route;
}