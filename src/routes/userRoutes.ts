import express from 'express';
import { createUser, logOutUser, updateUser, loginUser, deleteUser } from '~/controllers/userController';
import { authenticate } from '~/middleware/authenticate';

const router = express.Router();

router.post('/user/', createUser); // Create a new user
router.post('/user/logout', authenticate, logOutUser); // Logout a user
router.post('/user/update', authenticate, updateUser); // Update a user
router.post('/user/login', loginUser);
router.delete('/user/:userId', authenticate, deleteUser); // Delete a user

export default router;
