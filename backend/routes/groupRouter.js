const express = require('express');
const router=express.Router();

const groupController = require('../controllers/groupController');
router.post('/create',groupController.creeazaGrup);
router.post('/add-member',groupController.adaugaMembru);
router.delete('/remove-member',groupController.stergeMembru);
router.get('/:id/members',groupController.listaMembri);
router.get('/user/:id',groupController.afisazaGrupuri);
router.delete('/:id',groupController.stergeGrup);
module.exports=router;