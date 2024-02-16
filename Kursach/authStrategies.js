import { sql } from './db.js';
 

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
          return result;
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
  const result = await sql`SELECT * FROM users WHERE FIO = ${input} AND PasswordHash = ${password}`;
  return result[0]
  
};

const authenticateByEmail = async (credentials) => {
  const input = credentials.input;
  const password = credentials.password;
  const result = await sql`SELECT * FROM users WHERE email = ${input} AND PasswordHash = ${password}`;
  return result[0]
  

};

const authenticateByPhoneNumber = async (credentials) => {
  const input = credentials.input;
  const password = credentials.password;
  const result = await sql`SELECT * FROM users WHERE tel = ${input} AND PasswordHash = ${password}`;
  return result[0]
  
  
 

};



const multiAuthStrategy = new MultiAuthStrategy([
  new AuthStrategy(authenticateByEmail),
  new AuthStrategy(authenticateByPhoneNumber),
  new AuthStrategy(authenticateByLogin),
]);




export { AuthStrategy, multiAuthStrategy };