const express =require('express');
const router=express.Router();

const friendController=require('../controllers/friendController');
const searchController=require('../controllers/searchController');
router.post('/request',friendController.trimiteCerere);
router.put('/accept',friendController.acceptaCerere);
router.delete('/delete',friendController.stergerCerere);
router.get('/search', searchController.cautaUtilizator);
router.get('/list/:id',friendController.listaPrieteni);
module.exports=router;