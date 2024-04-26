import express from 'express';
import { findByName, findByNumber, getPersonDetails } from '~/controllers/search';
import { authenticate } from '~/middleware/authenticate';

const router = express.Router();

router.post('/findByName', authenticate, findByName); // Search by name
router.post('/findByNumber', authenticate, findByNumber); // Search by number
router.get('/details/:belongsTo/:id', getPersonDetails); // Search a particular entity

export default router;
