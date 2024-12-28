import jwt from 'jsonwebtoken';

const SECRET_KEY = 'afabc81c193dd5136dc0b1d09a71b2773ba738948ec8da5137db72534c551dc1c085ffd0ca3b17ba6ee7d97ff2ffcc662b8ca830ff5bdfb8567e8f0349872009'; // Ganti dengan key aman

interface Payload {
  username: string;
  role: string;
}

export const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Token berlaku 1 jam
};

export const verifyToken = (token: string): Payload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as Payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
