import jwt from 'jsonwebtoken';

const secretKey = '%!Am1r_GGWP!_!ecoActiv!_!12345!@#$%';

export const generateAccessToken = (userId, role) => {
  const payload = { userId, role };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};