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
  getWimon,
  postWimon,
  postSmartCooler,
  postAlya,
  getMonitoringPakanLele,
  postSandi,
  getTitikPemantauan,
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
  route.route('/wimon')
    .post(postWimon(models, io))
    .get(getWimon(models))
  route.route('/smart-cooler')
    .post(postSmartCooler(models))
  route.route('/alya')
    .post(postAlya(models))
  route.route('/sandi')
    .post(postSandi(models))
  route.route('/monitoring-lele')
    .get(getMonitoringPakanLele(models))
  route.route('/titik-pemantauan')
    .post(getTitikPemantauan(models))

  return route;
}