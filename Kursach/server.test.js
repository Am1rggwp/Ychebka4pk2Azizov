  const request = require('supertest');
  import app from './server.js';

  describe('Тесты Регистрация', () => {

    it('должен зарегистрировать нового пользователя', async () => {
      const userData = {
        name: 'аааа',
        email: 'ааааааr@example.com',
        tel: '1234567890',
        schoolClass: '2',
        password: 'existingpassword'
      };

      const response = await request(app)
        .post('/reg.html')
        .send(userData);

      expect(response.statusCode).toBe(200); 
      expect(response.header.location).toBe('/window/login.html'); 
    });

    it('не должен регистрировать пользователя с существующим именем', async () => {
      const existingUserData = {
        name: 'newuser',
        email: 'newuser@example.com',
        tel: '1234567890',
        schoolClass: '10',
        password: 'existingpassword'
      };

      const response = await request(app)
        .post('/reg.html')
        .send(existingUserData);

      expect(response.statusCode).toBe(302);
      expect(response.header.location).toBe('/window/windowError/regErrorName.html');
    });
  });

  /// аторизация
  describe('Тесты авторизации', () => {
    it('следует аутентифицировать пользователя с правильными учетными данными', async () => {
      const res = await request(app)
        .post('/window/login.html')
        .send({ name: 'аааа', password: 'existingpassword' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('userid');

    });

    it('должно возвращать ошибку из-за неправильных учетных данных', async () => {
      const res = await request(app)
        .post('/window/login.html')
        .send({ name: 'invalidUsername', password: 'invalidPassword' });
      expect(res.statusCode).toEqual(302); // Redirect status
    });
  });


  /// Итнересы пользователя
  describe('Тесты интересов пользователя', () => {

    it('должен добавить интерес пользователю', async () => {
      const response = await request(app)
        .post('/interes')
        .send({ id: '1' })
        .set('Cookie', ['userid=1']);

      expect(response.statusCode).toBe(200);
    });

    it('должен удалить интерес у пользователя', async () => {
      const response = await request(app)
        .delete('/interes')
        .send({ id: '1' })
        .set('Cookie', ['userid=1']);

      expect(response.statusCode).toBe(200);
    });

    it('должен получить интересы пользователя', async () => {
      const interestsIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const response = await request(app)
      
        .get('/interes')
        .send({ id: interestsIds })
        .set('Cookie', ['userid=1']);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(10);
    });

  });




  describe('Тесты создания и поиска кружков', () => {

    it('должен создать новый кружок', async () => {
      const response = await request(app)
        .post('/createCricle')
        .send({
          name: 'Новый кружок',
          schoolClass: '10',
          Ten: '20'
        });

      expect(response.statusCode).toBe(302);
    });

    it('не должен создавать кружок с существующим именем', async () => {
      const response = await request(app)
        .post('/createCricle')
        .send({
          name: 'Существующий кружок',
          schoolClass: '11',
          Ten: '10'
        });

      expect(response.statusCode).toBe(302);
    });

    it('должен искать кружки по параметрам', async () => {
      const response = await request(app)
        .post('/getSercle')
        .send({
          classNum: '10',
          serch: 'Новый',
          maxPeople: ['20', '30']
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
    });

  });

  describe('Тесты присоединения и выхода из кружка', () => {

    it('должен присоединиться к кружку', async () => {
      const response = await request(app)
        .post('/joincricle')
        .send({ id: '12' })
        .set('Cookie', ['userid=123']);

      expect(response.statusCode).toBe(200);
    });

    it('должен выйти из кружка', async () => {
      const response = await request(app)
        .patch('/outcricle')
        .set('Cookie', ['userid=123']);

      expect(response.statusCode).toBe(200);
    });

  });
