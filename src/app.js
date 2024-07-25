const express = require("express");
const cors = require("cors");
const sensorTesting = require('./routes/sensorTesting');
const { sequelizeInstance, Sequelize } = require('./configs/db.config');
const { importModels } = require('./models/index')
const models = importModels(sequelizeInstance, Sequelize);
const { verifyToken } = require('./middleware/VerifyToken');
const app = express();
const path = require('path');
const cron = require('node-cron');
let ejs = require("ejs");
let pdf = require("html-pdf");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const dotenv = require('dotenv');
dotenv.config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const swagger = require('./swagger')

dayjs.extend(utc);
dayjs.extend(timezone);

try {
  sequelizeInstance.authenticate();
  console.log('Connection has been established successfully.');
  
  // const corsOptions = { origin: "http://localhost:3000" };
  // app.use(cors(corsOptions));
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(cors({credentials:true, origin:'*'}));
  app.options("*", cors());
  // parse requests of content-type - application/json
  app.use(express.json({limit: '50mb'}));
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(express.static(path.join(__dirname,'/public')));
  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Backend Server." });
  });

  //views ejs
  app.get("/smart-cooler", async (req, res) => {
    const dataSmartCooler = await models.SmartCooler.findOne({ where:{ idSensor: 1 } });
    const hasil = {
      tegangan: dataSmartCooler.tegangan,
      suhu: dataSmartCooler.suhu,
      humidity: dataSmartCooler.humidity
    }
    res.render('smart-cooler', {
      data: hasil
    })
  });
  app.get("/smart-akuaponik", async (req, res) => {
    const dataSandiSensor = await models.SandiSensor.findOne({ where:{ idSensor: 1 } });
    const hasil = {
      ph: dataSandiSensor.ph,
      tds: dataSandiSensor.tds,
    }
    res.render('smart-akuaponik', {
      data: hasil
    })
  });

  //api
  app.use('/api/v1/sensor-testing', sensorTesting(models, io));
  
  app.use(swagger());

  const {
    getDataPanelSurya,
  } = require("./utils/socketIO-utils");

  // SocketIO
  io.on("connection", (socket) => {
    // console.log('A user is connected');

    socket.on("panelsurya-pesan", (msg) => {
      console.log(msg);
    });

    socket.on('message', (message) => {
      console.log(`message from ${socket.id} : ${message}`);
    })

    socket.on('disconnect', () => {
      console.log(`socket ${socket.id} disconnected`);
    })
  });

  // //cron job
  //   const { cronTransaksi, cronTransaksiDaily, cronUserActive } = require('./utils/cron.utils')
  //   //transaksi
  //   let transaksi = cron.schedule('0 1 * * *', async () => {
  //     console.log('cron transaksi', new Date());
  //     let response = await cronTransaksi(models)
  //     if(response == 'success') {
  //       console.log('selesai simpan data');
  //     }
  //   }, {
  //     scheduled: true,
  //     timezone: "Asia/Jakarta"
  //   });

  //   //transaksi daily
  //   let transaksidaily = cron.schedule('5 1 * * *', async () => {
  //     console.log('cron transaksi', new Date());
  //     let response = await cronTransaksiDaily(models)
  //     if(response == 'success') {
  //       console.log('selesai simpan data');
  //     }
  //   }, {
  //     scheduled: true,
  //     timezone: "Asia/Jakarta"
  //   });
    
  //   //user active member
  //   let userActiveMember = cron.schedule('10 1 * * *', async () => {
  //     console.log('cron user member', new Date());
  //     let response = await cronUserActive(models, '1', '0')
  //     if(response == 'success') {
  //       console.log('selesai simpan data');
  //     }
  //   }, {
  //     scheduled: true,
  //     timezone: "Asia/Jakarta"
  //   });
    
  //   //user active customer
  //   let userActiveCustomer = cron.schedule('15 1 * * *', async () => {
  //     console.log('cron user customer', new Date());
  //     let response = await cronUserActive(models, '0', '0')
  //     if(response == 'success') {
  //       console.log('selesai simpan data');
  //     }
  //   }, {
  //     scheduled: true,
  //     timezone: "Asia/Jakarta"
  //   });

  //   transaksi.start();
  //   transaksidaily.start();
  //   userActiveMember.start();
  //   userActiveCustomer.start();

  const PORT = process.env.PORT || 4400;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// set port, listen for requests
module.exports = app;