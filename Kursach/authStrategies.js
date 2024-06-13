import { sql } from './db.js';
import bcrypt  from "bcrypt";
import { generateAccessToken } from './utils/generateToken.js';
 

class AuthStrategy {
  constructor(authenticateFunction) {
    this.authenticateFunction = authenticateFunction;
  }

  async authenticate(credentials) {
    return this.authenticateFunction(credentials);
  }
}

class MultiAuthStrategy {
  constructor(strategies) {
    this.strategies = strategies;
  }
  async authenticate(credentials) {
    for (const strategy of this.strategies) {
      try {
        const result = await strategy.authenticate(credentials);
        if (result) {
          const token = generateAccessToken(result.id, result.role);
          return { token, user: result };
        }
      } catch (error) {
        console.error(`Ошибка при аутентификации с использованием: ${strategy.constructor.name}: ${error.message}`);
      }
    }
    return 'Неверные учетные данные';

  }
}

const authenticateByLogin = async (credentials) => {
  const input = credentials.input;
  const password = credentials.password;
  const result = await sql`SELECT * FROM users where FIO = ${input}`;
  if (result.length > 0) {
    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.passwordhash); // Асинхронная функция
    if (passwordMatch) {
      return user;
    }
  }
  return null;
};

const authenticateByEmail = async (credentials) => {
  const input = credentials.input;
  const password = credentials.password;
  const result = await sql`SELECT * FROM users where email = ${input}`;
  if (result.length > 0) {
    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.passwordhash); // Асинхронная функция
    if (passwordMatch) {
      return user;
    }
  }
  return null;
};

const authenticateByPhoneNumber = async (credentials) => {
  const input = credentials.input;
  const password = credentials.password;
  const result = await sql`SELECT * FROM users where tel = ${input}`;
  if (result.length > 0) {
    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.passwordhash); // Асинхронная функция
    if (passwordMatch) {
      return user;
    }
  }
  return null;
};



const multiAuthStrategy = new MultiAuthStrategy([
  new AuthStrategy(authenticateByEmail),
  new AuthStrategy(authenticateByPhoneNumber),
  new AuthStrategy(authenticateByLogin),
  
]);




export { AuthStrategy, multiAuthStrategy };