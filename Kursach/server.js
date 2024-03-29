import express, { json } from 'express';
import path from 'path';
import { sql } from './db.js';
import bodyParser from 'body-parser';
import { multiAuthStrategy } from './authStrategies.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import request from 'supertest';
import { log } from 'console';
import e from 'express';
const app = express();
const port = 8189;
// module.exports = app;



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(json())
app.use(cookieParser());
app.use(cors())


////////////////////////////////////////////////////////////////// вход

app.post('/window/login.html' || '/window/loginError.html', async (req, res) => {
  const input = req.body.name;
  const password = req.body.password;
  try {
    const result = await multiAuthStrategy.authenticate({ input, password });
    console.log(result)
    if (typeof result === 'string') {
      res.redirect('/window/windowError/loginError.html');
      return;
    }
    const roleid = result.role;
    const rolenamesql = await sql `select namerole from role where roleid = ${roleid}`;
    const rolename = rolenamesql[0].namerole;
    if (result) {
      res.cookie('userid', result.userid, { maxAge: 9000000000, httpOnly: false });
      res.cookie('idcircle', result.idcircle, { maxAge: 9000000000, httpOnly: false });
      res.cookie('username', result.fio, { maxAge: 9000000000, httpOnly: false });
      res.cookie('tel', result.tel, { maxAge: 9000000000, httpOnly: false });
      res.cookie('email', result.email, { maxAge: 9000000000, httpOnly: false });
      res.cookie('classus', result.classuser, { maxAge: 9000000000, httpOnly: false });
      res.cookie('role', result.role, { maxAge: 9000000000, httpOnly: false });
      res.cookie('rolename', rolename, { maxAge: 9000000000, httpOnly: false });
      res.redirect('/index.html');
      
      
      
    } else { }

  } catch (err) {
    console.error('Error authenticating user', err);
    res.status(500).send(err.message);
  }


});




///////////////////////////////////////////////////////////





////////////////////////////////////////////////////////// Выход
app.get('/out', async (req, res) => {
  res.clearCookie()
  res.send(200)
})
////////////////////////////////////////////////////////// 




////////////////////////////////////////////////////// Профиль
app.get('/interes', async (req, res) => {

  const interes = await sql`select * from Interests`
  const userinteres = await sql`select * from InterestsUser where UserId = ${req.cookies.userid}`


  // console.log(interes);
  // console.log(userinteres);
  try {
    const result = interes.map(el => {
      el.joined = userinteres.find((item, index, array) => {
        if (item.interestsid == el.interestsid) return true
      }) ? true : false
      return el
    })
    res.send(result)
  }
  catch (err) {
    res.redirect('/login.html');
  }


});

app.post('/interes', async (req, res) => {
  const iduserInteres = req.body.id;
  const result = await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, ${iduserInteres})`
  res.send(result)
});

app.delete('/interes', async (req, res) => {
  const iduserInteres = req.body.id;
  const result = await sql`DELETE FROM InterestsUser WHERE UserId = ${req.cookies.userid} and InterestsId = ${iduserInteres}`
  res.send(result)
});
/////////////////////////////////////





////////////////////////////////////////////////////////////    регистрация
app.post('/reg.html', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const tel = req.body.tel;
  const classUser = req.body.schoolClass;
  const password = req.body.password;

  try {
    const userExistname = await sql`SELECT * FROM users WHERE FIO = ${name}`;
    const userExistemail = await sql`SELECT * FROM users WHERE Email = ${email}`;
    const userExisttel = await sql`SELECT * FROM users WHERE Tel = ${tel}`;
    if (userExistname.length > 0) {
      res.redirect('/window/windowError/regErrorName.html');
    } else if (userExistemail.length > 0) {
      res.redirect('/window/windowError/regErrorEmail.html');
    } else if (userExisttel.length > 0) {
      res.redirect('/window/windowError/regErrorNumber.html');
    } else {
      const insert = await sql`
        INSERT INTO users (fio, email, tel, ClassUser ,PasswordHash, Role)
        VALUES (${name}, ${email}, ${tel},${classUser} ,${password}, 2)
      `;
      const insertInteresCri = await sql``

      res.redirect('/window/login.html');
    }
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).send(err.message);
  }
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reg.html'));
});
/////////////////////////////////////////////////





///////////////////////////////////////////////////////////// Создания куржка
app.post('/createCricle', async (req, res) => {
  const name = req.body.name;
  const ClassUsers = req.body.schoolClass;
  const quantitu = req.body.counthuman;
  const interesactive = req.body.activeIntereses;
  // console.log(quantitu)
  const Circle = await sql`select * from Сircle where namecricel = ${name}`;
  try {
    if (Circle.length > 0) {
      res.redirect('window/windowError/CreateCircleError.html');
    } else {
      const insert = await sql`
        INSERT INTO Сircle (NameCricel, QuantityUser, userclass)
        VALUES (${name},${quantitu},${ClassUsers})
      `;
      const criclecreat = await sql`select CricleID from Сircle where namecricel = ${name}`;
      const cricleID = criclecreat[0].cricleid;
      for (const interestId of interesactive) {
        await sql`
          INSERT INTO InterestsСircle (CricleID, InterestsId)
          VALUES (${cricleID}, ${interestId})
        `;
      }
    }
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).send(err.message);
  }
});
app.get('/interesFind', async (req, res) => {

  const interes = await sql`select * from Interests`;
  try {
    const result = interes.map(el => {
      el.joined = false;
      return el;
    });

    res.send(result);
  }
  catch (err) {
    console.error('Error registering user', err);
  }

});







//////////////////////////////////////////////////////////// Получение кружков
app.post('/getSercle', async (req, res) => {
  const { classNum, serch, maxPeople, interes } = req.body
  // console.log(classNum, serch, maxPeople);
  const classn = req.cookies.classus;
  const classuser = classn.slice(0, 1);
  const matchingCircles = await sql`
    SELECT DISTINCT ic.CricleID
    FROM InterestsСircle ic
    INNER JOIN InterestsUser iu ON ic.InterestsId = iu.InterestsId
    WHERE iu.UserId = ${req.cookies.userid}
  `;
  const circleIds = matchingCircles.map(cricleid =>cricleid.cricleid);
  const role = req.cookies.role;
  
  if(role == 1){
    let select = await sql`select * from Сircle`
    if (classNum.trim().length != 0) {
      select = select.filter(el => el.userclass == classNum)
    }
    if (maxPeople.length != 0) {
      select = select.filter(el => maxPeople.includes(`${el.quantityuser}`))
    }
    if (serch.trim().length != 0) {
      select = select.filter(el => el.namecricel.includes(serch.trim()))
    }
    // console.log(select);
    res.send(select)
  }
  else{
    let select = await sql`select * from Сircle where userclass = ${classuser} and cricleid in ${sql ([circleIds])}`
    if (classNum.trim().length != 0) {
      select = select.filter(el => el.userclass == classNum)
    }
    if (maxPeople.length != 0) {
      select = select.filter(el => maxPeople.includes(`${el.quantityuser}`))
    }
    if (serch.trim().length != 0) {
      select = select.filter(el => el.namecricel.includes(serch.trim()))
    }
    // console.log(select);
    res.send(select)
  }

});
app.get('/SerchCricleBlock', async (req, res) => () => {
  select = req.cookies.result;
  res.send(select);

});
////////////////////////////////////////////////////Встуаление
app.post('/joincricle', async (req, res) => {

  const { id } = req.body;
  const numericId = parseInt(id, 10); // Преобразование id в целое число

  if (isNaN(numericId)) {
    return res.status(400).send({ error: 'Invalid ID format' });
  }

  res.cookie('idcircle', numericId, { maxAge: 9000000000, httpOnly: false });

  try {
    const result = await sql`update Users set IdCircle = ${numericId} where UserId = ${req.cookies.userid}`;
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while updating the user.' });
  }

})
///////////////////////////////////////////////////Выход из кружка
app.patch('/outcricle', async (req, res) => {
  const result = await sql`update Users set IdCircle = ${null} where UserId = ${req.cookies.userid}`
  res.cookie('idcircle', null, { maxAge: 9000000000, httpOnly: false });
  res.send(result)

})

/////////////////////////////////////////////////////////// 







//////////////////////////////////////////////////////////// Запуск сервака и создания таблиц
const start = async () => {
  await sql`CREATE TABLE if not exists Users (
    UserId SERIAL PRIMARY KEY,
    FIO VARCHAR(70) NOT NULL unique, 
    Email VARCHAR(70) NOT NULL unique,
    Tel VARCHAR(11) NOT NULL unique,
    ClassUser VARCHAR(3) NULL,
    PasswordHash VARCHAR(100) NOT NULL,
    Role int NOT NULL,
    IdCircle int null
    )
    `;
  await sql`CREATE TABLE if not exists Role(
      RoleId SERIAL PRIMARY KEY,
      NameRole VARCHAR(70) NOT NULL
    )`

  await sql`CREATE TABLE if not exists RoleUser(
      UserRoleId SERIAL PRIMARY KEY,
      UserId INT REFERENCES Users(UserId),
      RoleId INT REFERENCES Role(RoleId),
      UNIQUE(UserId, RoleId)
      ) `;

  await sql`CREATE TABLE if not exists Interests (
    InterestsId SERIAL PRIMARY KEY,
    Name VARCHAR(70) NOT NULL unique
    )`;

  await sql`CREATE TABLE if not exists InterestsUser(
    UserInterestId SERIAL PRIMARY KEY,
    UserId INT REFERENCES Users(UserId),
    InterestsId INT REFERENCES Interests(InterestsId),
    UNIQUE(UserId, InterestsId)
    ) `;
  await sql`CREATE TABLE if not exists Сircle(
      CricleID SERIAL PRIMARY KEY,
      NameCricel varchar(50) NOT NULL unique,
      QuantityUser int NOT NULL,
      userclass varchar(2) NOT NULL

      ) `;
  await sql`CREATE TABLE if not exists InterestsСircle(
        СircleInterestId SERIAL PRIMARY KEY,
        CricleID INT REFERENCES Сircle(CricleID),
        InterestsId INT REFERENCES Interests(InterestsId),
        UNIQUE(CricleID, InterestsId)
        ) `;

  // await sql`INSERT INTO users (fio, email, tel ,PasswordHash, Role)
  //       VALUES ('Азизов Амир Наилевич', 'amir.azizov2015@mil.ru', '89619370939',1, 1)`

  // await sql`INSERT INTO Role (NameRole) VALUES
  // ('учител'),
  // ('ученик')`;

  // await sql`INSERT INTO Interests (Name) VALUES
  // ('Спорт'),
  // ('Музыка'),
  // ('Путешествия'),
  // ('Кулинария'),
  // ('Чтение'),
  // ('Игры'),
  // ('Фотография'),
  // ('Искусство'), 
  // ('Танцы'),
  // ('Программирование')`;

  app.listen(port, () => {
    // console.log(`Сервер запущен  http://192.168.149.56:${port}/window/login.html`);
    console.log(`Сервер запущен  http://192.168.0.108:${port}/window/login.html`);

  });

}

start()



