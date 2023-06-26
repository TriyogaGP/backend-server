const { Router } = require('express');
const { verifyToken } = require('../middleware/VerifyToken');
const {
  getServer,
  getServerAlarm,
  getJadwalSholat,
  getTanamanAriq,
  postTanamanAriq,
} = require('../controllers/sensorTesting.controller')

module.exports = models => {
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
    
  return route;
}