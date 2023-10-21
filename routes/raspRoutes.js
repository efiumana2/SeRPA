const express = require('express')
const raspControllers = require('../controllers/raspControllers.js')
const router = express.Router()

router.route('/status').get((req,res)=> {
    raspControllers.readAllRasp(req,res);
})

router.route('/status/:IdEdificio/:IdAula').get( (req,res)=> {
        raspControllers.readRasp(req,res);
})

router.route('/dati').post((req,res)=>{
    raspControllers.riceviDati(req,res);
})

router.route('/updateAllData').get( (req,res)=>{
    raspControllers.updateAllData(req,res);
})

router.route('/UpdateOneData/:IdEdificio/:IdAula').get( (req,res)=>{
    raspControllers.updateOneData(req,res);
})

router.route('/UpdateOneTimeout/:IdEdificio/:IdAula/:minuti').get( (req,res)=>{
    raspControllers.updateOneTimeout(req,res);
})

router.route('/GetLastValue/:IdEdificio/:IdAula').get( (req,res)=>{
    raspControllers.GetLastValue(req,res);
})

//router.route('/GetHistory/:IdEdificio/:IdAula').get( (req,res)=>{
router.route('/GetHistory/:IdEdificio/:IdAula/:DateFrom?/:DateTo?').get( (req,res)=>{
    raspControllers.GetHistory(req,res);
})

//CRUD Edifici
router.route('/Edifici').get((req,res) => {
    raspControllers.GetAllEdifici(req,res);
})
router.route('/Edifici/:IdEdificio').get((req,res) => {
    raspControllers.GetOneEdificio(req,res);
})
router.route('/Edifici').post((req,res) => {
    raspControllers.inserisciEdificio(req,res);
})
router.route('/Edifici/:IdEdificio').put((req,res) => {
    raspControllers.modificaEdificio(req,res);
})
router.route('/Edifici/:IdEdificio').delete((req,res) => {
    raspControllers.cancellaEdificio(req,res);
})

//CRUD Aule
router.route('/Aule/:ID_Edificio').get((req,res) => {
    raspControllers.GetAllAule(req,res);
})
router.route('/Aule/:ID_Edificio/:ID_Aula').get((req,res) => {
    raspControllers.GetOneAula(req,res);
})
router.route('/Aule/:ID_Edificio').post((req,res) => {
    raspControllers.inserisciAula(req,res);
})
router.route('/Aule/:ID_Edificio/:ID_Aula').put((req,res) => {
    raspControllers.modificaAula(req,res);
})
router.route('/Aule/:IdEdificio/:ID_Aula').delete((req,res) => {
    raspControllers.cancellaAula(req,res);
})

//CRUD Utenti
router.route('/Users').get((req,res) => {
    raspControllers.GetAllUsers(req,res);
})
router.route('/Users/:ID_Utente').get((req,res) => {
    raspControllers.GetOneUser(req,res);
})
router.route('/Users').post((req,res) => {
    raspControllers.NewUser(req,res);
})
router.route('/Users/:ID_Utente').put((req,res) => {
    raspControllers.ModifyUser(req,res);
})
router.route('/Users/:ID_Utente').delete((req,res) => {
    raspControllers.DeleteUser(req,res);
})
router.route('/CheckUsername/:Username').get((req,res) => {
    raspControllers.CheckUsername(req,res);
})
/*
router.route('/CambiaPassword/:ID_Utente/:OldPasswd/:NewPasswd').get((req,res) => {
    raspControllers.CambiaPassword(req,res);
})
*/


module.exports = router;