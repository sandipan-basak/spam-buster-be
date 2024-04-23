import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { signupSchema } from '~/utils/validator';

const secretKey = process.env.SECRET_KEY ?? 'secret_key';

export const authenticate = (req: Request, res: Response, next: NextFunction): any => {
  const cookieHeader = req.headers.cookie;
  const cookies: Record<string, string> = {};

  cookieHeader?.split(';').forEach(cookie => {
    const [name, value] = cookie.split('=').map(c => c.trim());
    cookies[name] = value;
  });
  const token = cookies.sid;

  if (token == null && token === '') {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err != null) {
      return res.sendStatus(403);
    }

    req.body.user = user;
    next();
  });
};

export const validateSignup = (req: Request, res: Response, next: NextFunction): any => {
  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error != null) {
    return res.status(400).json({ errors: error.details });
  }

  next();
};
