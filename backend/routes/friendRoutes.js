const express =require('express');
const router=express.Router();

const friendController=require('../controllers/friendController');
const searchController=require('../controllers/searchController');
router.post('/request',friendController.trimiteCerere);
router.put('/accept',friendController.acceptaCerere);
router.delete('/delete',friendController.stergerCerere);
router.get('/search', searchController.cautaUtilizator);
router.get('/list/:id',friendController.listaPrieteni);
router.get('/requests/received/:id_eu', friendController.cereriPrimite);
router.get('/requests/sent/:id_eu', friendController.cereriTrimise);
router.delete('/request/cancel', friendController.anuleazaCerereTrimisa);


module.exports=router;