import express from 'express';
import { reportSpam, removeSpamVote } from '~/controllers/spamCRUD';
import { authenticate } from '~/middleware/authenticate';

const router = express.Router();

router.post('/markNumber', authenticate, reportSpam); // Mark a user sapm
router.post('/removeSpamVote', authenticate, removeSpamVote); // Mark a user sapm

export default router;
