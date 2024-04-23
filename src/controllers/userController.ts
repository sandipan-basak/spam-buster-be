// Controller/userController.ts
import { type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '~/models/user';

export const createUser = async (req: {
  body: {
    name: string
    email?: string
    phoneNumber: string
    password: string
  }
}, res: Response): Promise<any> => {
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
