const {
	response,
	OK,
	NOT_FOUND,
	NO_CONTENT
} = require('../utils/response.utils');
const {
	encrypt,
	decrypt,
	buildMysqlResponseWithPagination
} = require('../utils/helper.utils');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const { logger } = require('../configs/db.winston')
const nodeGeocoder = require('node-geocoder');
const { request } = require('../utils/request');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL

function getServer (models) {
  return async (req, res, next) => {
		let { humidity, suhu } = req.query
    try {
			return OK(res, { humidity: Number(humidity), suhu: Number(suhu) })
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getServerAlarm (models) {
  return async (req, res, next) => {
		let { day } = req.query
    try {
			// const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"]
			// const hari_ini = hari[new Date().getDay()];
			const dataAlarm = await models.Alarm.findAll({ attributes: ['hari','waktu'] });
			const result = []
			dataAlarm.map(str => {
				const hari = str.hari.split(',');
				if(hari.includes(day)){
					result.push(str.waktu);
				}
			})

			let record = {};
			let no = 0;
			for (let k = 0; k < result.length; k++) {
				no = k + 1;
				let objName = 'alarm_' + no;
				let objValue = result[k];
				record[objName] = objValue;
			}
			
			return OK(res, record)
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function getJadwalSholat (models) {
  return async (req, res, next) => {
		let { kategori } = req.query
    try {
			const date = new Date();
			const year = date.getFullYear();
			const month = ("0" + (date.getMonth() + 1)).slice(-2);
			const day = ("0" + date.getDate()).slice(-2);
			const urlJadwalSholat = kategori === 'hari' ? `${year}/${month}/${day}` : `${year}/${month}`
			const { data: response } = await request({
				url: `https://api.myquran.com/v1/sholat/jadwal/1204/${urlJadwalSholat}`,
				method: 'GET',
			})
			if(kategori === 'hari'){
				const { id, lokasi, daerah, koordinat, jadwal } = response.data
				let jadwalSholatPlus = _buildJadwalPlus(jadwal)
				let jadwalSholatMinus = _buildJadwalMinus(jadwal)
				
				return OK(res, { id, lokasi, daerah, koordinat, jadwal, jadwalSholatPlus, jadwalSholatMinus })
			}else{
				return OK(res, response.data)
			}
    } catch (err) {
			return NOT_FOUND(res, err.message)
    }
  }  
}

function _buildJadwalPlus(jadwal) {
	//imsak
	let splitimsak = jadwal.imsak.split(":")
	let imsakAwal = Number(splitimsak[0])
	let imsakAkhir = Number(splitimsak[1])
	let awalImsak = imsakAwal
	let akhirImsak = imsakAkhir + 1
	if(akhirImsak == 60){
		awalImsak = awalImsak + 1
		akhirImsak = 0
	}else{
		awalImsak = awalImsak
		akhirImsak = akhirImsak
	}
	awalImsak = awalImsak >= 0 && awalImsak < 10 ? "0"+String(awalImsak) : String(awalImsak)
	let imsakStr = akhirImsak >= 0 && akhirImsak < 10 ? awalImsak+":0"+String(akhirImsak) : awalImsak+":"+String(akhirImsak)

	//subuh
	let splitsubuh = jadwal.subuh.split(":")
	let subuhAwal = Number(splitsubuh[0])
	let subuhAkhir = Number(splitsubuh[1])
	let awalSubuh = subuhAwal
	let akhirSubuh = subuhAkhir + 1
	if(akhirSubuh == 60){
		awalSubuh = awalSubuh + 1
		akhirSubuh = 0
	}else{
		awalSubuh = awalSubuh
		akhirSubuh = akhirSubuh
	}
	awalSubuh = awalSubuh >= 0 && awalSubuh < 10 ? "0"+String(awalSubuh) : String(awalSubuh)
	let subuhStr = akhirSubuh >= 0 && akhirSubuh < 10 ? awalSubuh+":0"+String(akhirSubuh) : awalSubuh+":"+String(akhirSubuh)

	//terbit
	let splitterbit = jadwal.terbit.split(":")
	let terbitAwal = Number(splitterbit[0])
	let terbitAkhir = Number(splitterbit[1])
	let awalTerbit = terbitAwal
	let akhirTerbit = terbitAkhir + 1
	if(akhirTerbit == 60){
		awalTerbit = awalTerbit + 1
		akhirTerbit = 0
	}else{
		awalTerbit = awalTerbit
		akhirTerbit = akhirTerbit
	}
	awalTerbit = awalTerbit >= 0 && awalTerbit < 10 ? "0"+String(awalTerbit) : String(awalTerbit)
	let terbitStr = akhirTerbit >= 0 && akhirTerbit < 10 ? awalTerbit+":0"+String(akhirTerbit) : awalTerbit+":"+String(akhirTerbit)

	//dhuha
	let splitdhuha = jadwal.dhuha.split(":")
	let dhuhaAwal = Number(splitdhuha[0])
	let dhuhaAkhir = Number(splitdhuha[1])
	let awalDhuha = dhuhaAwal
	let akhirDhuha = dhuhaAkhir + 1
	if(akhirDhuha == 60){
		awalDhuha = awalDhuha + 1
		akhirDhuha = 0
	}else{
		awalDhuha = awalDhuha
		akhirDhuha = akhirDhuha
	}
	awalDhuha = awalDhuha >= 0 && awalDhuha < 10 ? "0"+String(awalDhuha) : String(awalDhuha)
	let dhuhaStr = akhirDhuha >= 0 && akhirDhuha < 10 ? awalDhuha+":0"+String(akhirDhuha) : awalDhuha+":"+String(akhirDhuha)
	
	//dzuhur
	let splitdzuhur = jadwal.dzuhur.split(":")
	let dzuhurAwal = Number(splitdzuhur[0])
	let dzuhurAkhir = Number(splitdzuhur[1])
	let awalDzuhur = dzuhurAwal
	let akhirDzuhur = dzuhurAkhir + 1
	if(akhirDzuhur == 60){
		awalDzuhur = awalDzuhur + 1
		akhirDzuhur = 0
	}else{
		awalDzuhur = awalDzuhur
		akhirDzuhur = akhirDzuhur
	}
	awalDzuhur = awalDzuhur >= 0 && awalDzuhur < 10 ? "0"+String(awalDzuhur) : String(awalDzuhur)
	let dzuhurStr = akhirDzuhur >= 0 && akhirDzuhur < 10 ? awalDzuhur+":0"+String(akhirDzuhur) : awalDzuhur+":"+String(akhirDzuhur)
	
	//ashar
	let splitashar = jadwal.ashar.split(":")
	let asharAwal = Number(splitashar[0])
	let asharAkhir = Number(splitashar[1])
	let awalAshar = asharAwal
	let akhirAshar = asharAkhir + 1
	if(akhirAshar == 60){
		awalAshar = awalAshar + 1
		akhirAshar = 0
	}else{
		awalAshar = awalAshar
		akhirAshar = akhirAshar
	}
	awalAshar = awalAshar >= 0 && awalAshar < 10 ? "0"+String(awalAshar) : String(awalAshar)
	let asharStr = akhirAshar >= 0 && akhirAshar < 10 ? awalAshar+":0"+String(akhirAshar) : awalAshar+":"+String(akhirAshar)
	
	//maghrib
	let splitmaghrib = jadwal.maghrib.split(":")
	let maghribAwal = Number(splitmaghrib[0])
	let maghribAkhir = Number(splitmaghrib[1])
	let awalMaghrib = maghribAwal
	let akhirMaghrib = maghribAkhir + 1
	if(akhirMaghrib == 60){
		awalMaghrib = awalMaghrib + 1
		akhirMaghrib = 0
	}else{
		awalMaghrib = awalMaghrib
		akhirMaghrib = akhirMaghrib
	}
	awalMaghrib = awalMaghrib >= 0 && awalMaghrib < 10 ? "0"+String(awalMaghrib) : String(awalMaghrib)
	let maghribStr = akhirMaghrib >= 0 && akhirMaghrib < 10 ? awalMaghrib+":0"+String(akhirMaghrib) : awalMaghrib+":"+String(akhirMaghrib)
	
	//isya
	let splitisya = jadwal.isya.split(":")
	let isyaAwal = Number(splitisya[0])
	let isyaAkhir = Number(splitisya[1])
	let awalIsya = isyaAwal
	let akhirIsya = isyaAkhir + 1
	if(akhirIsya == 60){
		awalIsya = awalIsya + 1
		akhirIsya = 0
	}else{
		awalIsya = awalIsya
		akhirIsya = akhirIsya
	}
	awalIsya = awalIsya >= 0 && awalIsya < 10 ? "0"+String(awalIsya) : String(awalIsya)
	let isyaStr = akhirIsya >= 0 && akhirIsya < 10 ? awalIsya+":0"+String(akhirIsya) : awalIsya+":"+String(akhirIsya)

	const jadwalSholat = {
		tanggal: jadwal.tanggal,
		imsak: imsakStr,
		subuh: subuhStr,
		terbit: terbitStr,
		dhuha: dhuhaStr,
		dzuhur: dzuhurStr,
		ashar: asharStr,
		maghrib: maghribStr,
		isya: isyaStr,
		date: jadwal.date,
	}
	return jadwalSholat
}

function _buildJadwalMinus(jadwal) {
	//imsak
	let splitimsak = jadwal.imsak.split(":")
	let imsakAwal = Number(splitimsak[0])
	let imsakAkhir = Number(splitimsak[1])
	let awalImsak = imsakAwal
	let akhirImsak = imsakAkhir - 1
	if(akhirImsak == 60){
		awalImsak = awalImsak - 1
		akhirImsak = 0
	}else{
		awalImsak = awalImsak
		akhirImsak = akhirImsak
	}
	awalImsak = awalImsak >= 0 && awalImsak < 10 ? "0"+String(awalImsak) : String(awalImsak)
	let imsakStr = akhirImsak >= 0 && akhirImsak < 10 ? awalImsak+":0"+String(akhirImsak) : awalImsak+":"+String(akhirImsak)

	//subuh
	let splitsubuh = jadwal.subuh.split(":")
	let subuhAwal = Number(splitsubuh[0])
	let subuhAkhir = Number(splitsubuh[1])
	let awalSubuh = subuhAwal
	let akhirSubuh = subuhAkhir - 1
	if(akhirSubuh == 60){
		awalSubuh = awalSubuh - 1
		akhirSubuh = 0
	}else{
		awalSubuh = awalSubuh
		akhirSubuh = akhirSubuh
	}
	awalSubuh = awalSubuh >= 0 && awalSubuh < 10 ? "0"+String(awalSubuh) : String(awalSubuh)
	let subuhStr = akhirSubuh >= 0 && akhirSubuh < 10 ? awalSubuh+":0"+String(akhirSubuh) : awalSubuh+":"+String(akhirSubuh)

	//terbit
	let splitterbit = jadwal.terbit.split(":")
	let terbitAwal = Number(splitterbit[0])
	let terbitAkhir = Number(splitterbit[1])
	let awalTerbit = terbitAwal
	let akhirTerbit = terbitAkhir - 1
	if(akhirTerbit == 60){
		awalTerbit = awalTerbit - 1
		akhirTerbit = 0
	}else{
		awalTerbit = awalTerbit
		akhirTerbit = akhirTerbit
	}
	awalTerbit = awalTerbit >= 0 && awalTerbit < 10 ? "0"+String(awalTerbit) : String(awalTerbit)
	let terbitStr = akhirTerbit >= 0 && akhirTerbit < 10 ? awalTerbit+":0"+String(akhirTerbit) : awalTerbit+":"+String(akhirTerbit)

	//dhuha
	let splitdhuha = jadwal.dhuha.split(":")
	let dhuhaAwal = Number(splitdhuha[0])
	let dhuhaAkhir = Number(splitdhuha[1])
	let awalDhuha = dhuhaAwal
	let akhirDhuha = dhuhaAkhir - 1
	if(akhirDhuha == 60){
		awalDhuha = awalDhuha - 1
		akhirDhuha = 0
	}else{
		awalDhuha = awalDhuha
		akhirDhuha = akhirDhuha
	}
	awalDhuha = awalDhuha >= 0 && awalDhuha < 10 ? "0"+String(awalDhuha) : String(awalDhuha)
	let dhuhaStr = akhirDhuha >= 0 && akhirDhuha < 10 ? awalDhuha+":0"+String(akhirDhuha) : awalDhuha+":"+String(akhirDhuha)
	
	//dzuhur
	let splitdzuhur = jadwal.dzuhur.split(":")
	let dzuhurAwal = Number(splitdzuhur[0])
	let dzuhurAkhir = Number(splitdzuhur[1])
	let awalDzuhur = dzuhurAwal
	let akhirDzuhur = dzuhurAkhir - 1
	if(akhirDzuhur == 60){
		awalDzuhur = awalDzuhur - 1
		akhirDzuhur = 0
	}else{
		awalDzuhur = awalDzuhur
		akhirDzuhur = akhirDzuhur
	}
	awalDzuhur = awalDzuhur >= 0 && awalDzuhur < 10 ? "0"+String(awalDzuhur) : String(awalDzuhur)
	let dzuhurStr = akhirDzuhur >= 0 && akhirDzuhur < 10 ? awalDzuhur+":0"+String(akhirDzuhur) : awalDzuhur+":"+String(akhirDzuhur)
	
	//ashar
	let splitashar = jadwal.ashar.split(":")
	let asharAwal = Number(splitashar[0])
	let asharAkhir = Number(splitashar[1])
	let awalAshar = asharAwal
	let akhirAshar = asharAkhir - 1
	if(akhirAshar == 60){
		awalAshar = awalAshar - 1
		akhirAshar = 0
	}else{
		awalAshar = awalAshar
		akhirAshar = akhirAshar
	}
	awalAshar = awalAshar >= 0 && awalAshar < 10 ? "0"+String(awalAshar) : String(awalAshar)
	let asharStr = akhirAshar >= 0 && akhirAshar < 10 ? awalAshar+":0"+String(akhirAshar) : awalAshar+":"+String(akhirAshar)
	
	//maghrib
	let splitmaghrib = jadwal.maghrib.split(":")
	let maghribAwal = Number(splitmaghrib[0])
	let maghribAkhir = Number(splitmaghrib[1])
	let awalMaghrib = maghribAwal
	let akhirMaghrib = maghribAkhir - 1
	if(akhirMaghrib == 60){
		awalMaghrib = awalMaghrib - 1
		akhirMaghrib = 0
	}else{
		awalMaghrib = awalMaghrib
		akhirMaghrib = akhirMaghrib
	}
	awalMaghrib = awalMaghrib >= 0 && awalMaghrib < 10 ? "0"+String(awalMaghrib) : String(awalMaghrib)
	let maghribStr = akhirMaghrib >= 0 && akhirMaghrib < 10 ? awalMaghrib+":0"+String(akhirMaghrib) : awalMaghrib+":"+String(akhirMaghrib)
	
	//isya
	let splitisya = jadwal.isya.split(":")
	let isyaAwal = Number(splitisya[0])
	let isyaAkhir = Number(splitisya[1])
	let awalIsya = isyaAwal
	let akhirIsya = isyaAkhir - 1
	if(akhirIsya == 60){
		awalIsya = awalIsya - 1
		akhirIsya = 0
	}else{
		awalIsya = awalIsya
		akhirIsya = akhirIsya
	}
	awalIsya = awalIsya >= 0 && awalIsya < 10 ? "0"+String(awalIsya) : String(awalIsya)
	let isyaStr = akhirIsya >= 0 && akhirIsya < 10 ? awalIsya+":0"+String(akhirIsya) : awalIsya+":"+String(akhirIsya)

	const jadwalSholat = {
		tanggal: jadwal.tanggal,
		imsak: imsakStr,
		subuh: subuhStr,
		terbit: terbitStr,
		dhuha: dhuhaStr,
		dzuhur: dzuhurStr,
		ashar: asharStr,
		maghrib: maghribStr,
		isya: isyaStr,
		date: jadwal.date,
	}
	return jadwalSholat
}

function postTanamanAriq (models) {
	return async (req, res, next) => {
		let { suhu, humidity, kelembaban, warna } = req.query
	  try {
			await models.AriqTanaman.update({
				suhu, humidity, kelembaban, warna
			}, { where: { idSensor: 1 } })
			return OK(res)
	  } catch (err) {
			return NOT_FOUND(res, err.message)
	  }
	}  
}

function getTanamanAriq (models) {
	return async (req, res, next) => {
	  try {
			const dataTanaman = await models.AriqTanaman.findOne();
			return OK(res, dataTanaman)
	  } catch (err) {
			return NOT_FOUND(res, err.message)
	  }
	}  
}

module.exports = {
	getServer,
	getServerAlarm,
	getJadwalSholat,
	postTanamanAriq,
	getTanamanAriq,
}