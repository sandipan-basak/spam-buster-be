import express from 'express';
import { createUser, logOutUser, updateUser, loginUser, deleteUser } from '~/controllers/userCRUD';
import { authenticate } from '~/middleware/authenticate';

const router = express.Router();

router.post('/create', createUser); // Create a new user
router.post('/logout', authenticate, logOutUser); // Logout a user
router.post('/update', authenticate, updateUser); // Update a user
router.post('/login', loginUser); // Login a user
router.delete('/:id', authenticate, deleteUser); // Delete a user

export default router;
