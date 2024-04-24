// Controller/userController.ts
import { type Response, type NextFunction, type Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '~/models/user';
import { type UpdateUserRequestBody } from '~/config/domain/user';

export const createUser = async (req: {
  body: {
    name: string
    email?: string
    phoneNumber: string
    password: string
  }
}, res: Response): Promise<void> => {
  const { name, email, phoneNumber, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: email ?? null,
      phone_number: phoneNumber,
      pw_hash: hashedPassword
    });

    // Create a JWT token
    const token = jwt.sign(
      { userId: newUser.id, name: newUser.name, email: newUser.email },
      process.env.SECRET_KEY ?? 'secret_key',
      { expiresIn: '7d' }
    );

    // Set a cookie with the JWT
    res.cookie('sid', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phone_number
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const logOutUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.cookie('sid', '', { expires: new Date(0) });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request<any, any, UpdateUserRequestBody>, res: Response): Promise<void> => {
  const { userId, name, email, phoneNumber, password } = req.body;

  try {
    const userToUpdate = await User.findByPk(userId);
    if (userToUpdate == null) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    if (password != null) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userToUpdate.pw_hash = hashedPassword;
    }

    userToUpdate.name = name ?? userToUpdate.name;
    userToUpdate.email = email ?? userToUpdate.email;
    userToUpdate.phone_number = phoneNumber ?? userToUpdate.phone_number;

    await userToUpdate.save();

    res.status(200).json({
      id: userToUpdate.id,
      name: userToUpdate.name,
      email: userToUpdate.email,
      phoneNumber: userToUpdate.phone_number
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId; // Assuming userID is passed as a URL parameter

  try {
    const userToDelete = await User.findByPk(userId);
    if (userToDelete == null) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    await userToDelete.destroy();
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export const loginUser = async (req: Request<any, any, {
  phoneNumber: string
  password: string
}>, res: Response): Promise<void> => {
  const { password, phoneNumber } = req.body;

  try {
    let user = null;

    user = await User.findOne({ where: { phone_number: phoneNumber } });

    if (user == null) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.pw_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY ?? 'default_secret_key',
      { expiresIn: '1h' }
    );

    res.cookie('sid', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict'
    });

    res.status(200).json({
      message: 'Logged in successfully.',
      token,
      userId: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
