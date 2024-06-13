import express, { json } from 'express';
import path from 'path';
import { sql } from './db.js';
import bodyParser from 'body-parser';
import { multiAuthStrategy } from './authStrategies.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import request from 'supertest';
import { Console, log } from 'console';
import e from 'express';
import multer from 'multer';
import upload from './upload.js';
import uploadUser from './uploadUser.js';
import uploadCircle from './uploadCircle.js';
import uploadCircleNews from './uploadCircleNews.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs, { read } from 'fs';
import bcrypt from "bcrypt";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 8189;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(json())
app.use(cookieParser());
app.use(cors())

////////////////////////////////////////////////////////////////// вход
app.post(['/window/login.html', '/window/loginError.html'], async (req, res) => {
  const { name: input, password } = req.body;

  try {
    const result = await multiAuthStrategy.authenticate({ input, password });
    
    if (typeof result === 'string') {
      return res.redirect('/window/windowError/loginError.html');
    }

    if (result) {
      const { user } = result;
      const { role, userid, idcircle, fio, tel, email, classuser, creator } = user;

      const [{ namerole: rolename }] = await sql`select NameRole from Role where RoleId = ${role}`;

      const cookieOptions = { maxAge: 9000000000, httpOnly: false };
      res.cookie('userid', userid, cookieOptions);
      res.cookie('idcircle', idcircle, cookieOptions);
      res.cookie('username', fio, cookieOptions);
      res.cookie('tel', tel, cookieOptions);
      res.cookie('email', email, cookieOptions);
      res.cookie('classus', classuser, cookieOptions);
      res.cookie('role', role, cookieOptions);
      res.cookie('rolename', rolename, cookieOptions);
      res.cookie('creator', creator, cookieOptions);

      return res.redirect('/window/hiwin.html');
    }
  } catch (err) {
    console.error('Error authenticating user', err);
    res.status(500).send('Internal Server Error');
  }
});

////////////////////////////////////////////////////////// Выход
app.get('/out', async (req, res) => {
  res.clearCookie()
  res.send(200)
})

////////////////////////////////////////////////////////////регистрация
app.post('/reg.html', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const tel = req.body.tel;
  const classUser = req.body.schoolClass;
  const password = req.body.password;
  const key = req.body.key;

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
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      if (key) {
        const slectkey = await sql`SELECT idSecritKey FROM secritKey WHERE Key = ${key}`;
        if (slectkey.length > 0) {
          const selectuser = await sql`SELECT UserId FROM Users WHERE idSecritKey = ${slectkey[0].idsecritkey}`;
          if (selectuser.length == 0) {
            const resKey = slectkey[0].idsecritkey;
            await sql`
              INSERT INTO users (fio, email, tel, idSecritKey, PasswordHash, Role, PhotoPathUser)
              VALUES (${name}, ${email}, ${tel}, ${resKey}, ${hashedPassword}, 1, 'photoUser/17116223670001.jpg')
            `;
          } else {
            return res.redirect('/window/windowError/regErrorNumber.html');
          }
        } else {
          return res.redirect('/window/windowError/regErrorKey.html');
        }
      } else {
        await sql`
          INSERT INTO users (fio, email, tel, ClassUser, PasswordHash, Role, PhotoPathUser)
          VALUES (${name}, ${email}, ${tel}, ${classUser}, ${hashedPassword}, 2, 'photoUser/17116223670001.jpg')
        `;
      }
      res.redirect('/Index.html');
    }
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).send(err.message);
  }
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reg.html'));
});

////////////////////////////////////////////////////// Профиль
app.get('/interes', async (req, res) => {

  const interes = await sql`select * from Interests `
  const userinteres = await sql`select * from InterestsUser where UserId = ${req.cookies.userid}`
  try {
    const result = interes.map(el => {
      el.joined = userinteres.find((item, index, array) => {
        if (item.interestsid == el.interestsid) return true
      }) ? true : false
      return el
    })
    res.send(result);
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
app.post('/namecricle', async (req, res) => {
  try {
    if (req.cookies.idcircle) {
      const resultname = await sql`SELECT NameCricel FROM Circle WHERE CricleID = ${req.cookies.idcircle}`;
      const namecricel = resultname.length > 0 ? resultname[0].namecricel : '';
      console.log(resultname);
      res.cookie('namecricel', namecricel, { maxAge: 9000000000, httpOnly: false });
    } else {
      console.error('ID кружка не был найден в куки.');
    }
  } catch (error) {
    console.error('Error fetching namecricel:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

/////////////////////////////////////////////////////////////////Опросник
app.post('/sendAnswer', async (req, res) => {
  try {
    const answers = req.body;
    const a = answers["a"];
    const b = answers["b"];
    const c = answers["c"];
    if (a > 0 || b > 0 || c > 0) {
      const interes = await sql`select * from Interests `
      const userinteres = await sql`select * from InterestsUser where UserId = ${req.cookies.userid}`
      const result = interes.map(el => {
        el.joined = userinteres.find((item, index, array) => {
          if (item.interestsid == el.interestsid) return true
        }) ? true : false
        return el
      })
      const interestsToDelete = result.filter(el => el.joined);
      for (const interest of interestsToDelete) {
        await sql`DELETE FROM InterestsUser WHERE UserId = ${req.cookies.userid} and InterestsId = ${interest.interestsid}`;
      }
      if (a > b && a > c) {
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 1)`
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 2)`
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 7)`
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 10)`
        res.json({ success: true, redirectUrl: '/window/Profil.html' });
      }
      else if (b > c) {
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 3)`
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 8)`
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 5)`
        res.json({ success: true, redirectUrl: '/window/Profil.html' });
      }
      else {
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 4)`
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 6)`
        await sql`insert into InterestsUser(UserId, InterestsId) values(${req.cookies.userid}, 9)`
        res.json({ success: true, redirectUrl: '/window/Profil.html' });
      }
    }
    else {
      res.json({ success: true, redirectUrl: '/window/Profil.html' });
    }
  }
  catch (err) {
    console.log("Error:" + err.message)
  }
});

/////////////////////////////////////////////////////////////////Аватарки 
app.get('/imgUserAva', async (req, res) => {

  try {
    const resulselect = await sql`select*from Users where UserId = ${req.cookies.userid}`;
    const datanew = resulselect.map(el => ({
      PhotoPathUser: el.photopathuser.replace('public/', ''),
    }));
    if (req.cookies.idcircle != 'j:null') {
      const select = await sql`select namecricel from circle where cricleid = ${req.cookies.idcircle}`;
      const selectname = select[0].namecricel;
      res.cookie('namecricel', selectname, { maxAge: 9000000000, httpOnly: false });

    }
    else {
      res.cookie('namecricel', '-', { maxAge: 9000000000, httpOnly: false });
    }
    res.send(datanew);
  } catch (error) {
    console.error('Error loading photo', err);
  }
})
app.post('/imgUser', uploadUser.single('photos'), async (req, res) => {

  const photoPath = req.file.path.replace(/\\/g, '/');
  try {
    const resulselect = await sql`SELECT PhotoPathUser FROM Users WHERE UserId = ${req.cookies.userid}`;
    if (resulselect.length > 0) {
      const photoPathdel = resulselect[0].photopathuser;
      if (photoPathdel && photoPathdel !== '17116223670001.jpg') {
        try {
          await fs.promises.unlink(`${photoPathdel}`);
        } catch (err) {
          console.error('Error deleting file', err);
        }
      }
    }
    await sql`
          UPDATE Users
          SET PhotoPathUser = ${photoPath}
          WHERE UserId = ${req.cookies.userid}
      `;
    res.json({ success: true, redirectUrl: '/window/Profil.html' });
  } catch (err) {
    console.error('Error uploading photo', err);
    res.status(500).send(err.message);
  }
});

///////////////////////////////////////////////////////////// Создания кружка
app.post('/createCricle', async (req, res) => {
  const name = req.body.name;
  const ClassUsers = req.body.schoolClass;
  const quantitu = req.body.counthuman;
  const interesactive = req.body.activeIntereses;

  try {
    const Circle = await sql`select * from Circle where namecricel = ${name}`;
    if (Circle.length > 0) {
      res.json({ success: true, redirectUrl: '/window/CreateCircleError.html' });
    } else {
      const insert = await sql`
        INSERT INTO Circle (NameCricel, QuantityUser, userclass, photopath )
        VALUES (${name},${quantitu},${ClassUsers},'public/photoCircle/17001.jpg')
      `;
      const criclecreat = await sql`select CricleID from Circle where namecricel = ${name}`;
      const cricleID = criclecreat[0].cricleid;
      for (const interestId of interesactive) {
        await sql`
          INSERT INTO InterestsСircle (CricleID, InterestsId)
          VALUES (${cricleID}, ${interestId})
        `;
      }
      if (insert.count > 0) {
        await sql`UPDATE Users SET creator = ${cricleID}, IdCircle = ${cricleID} 
        where UserId = ${req.cookies.userid}`
        const aupdate = await sql`select creator from Users where UserId = ${req.cookies.userid}`;
        const result = aupdate[0].creator;
        res.cookie('creator', result, { maxAge: 9000000000, httpOnly: false });
        res.json({ success: true, redirectUrl: '/window/ThridHerf.html' });
      } else {
        res.status(500).json({ success: false, error: 'Failed to insert data into Circle table' });
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
  try {
    const { classNum, serch, maxPeople, interes } = req.body
    const classn = req.cookies.classus;
    const classuser = classn.slice(0, 1);
    const matchingCircles = await sql`
    SELECT DISTINCT ic.CricleID
    FROM InterestsСircle ic
    INNER JOIN InterestsUser iu ON ic.InterestsId = iu.InterestsId
    WHERE iu.UserId = ${req.cookies.userid}
  `;
    const circleIds = matchingCircles.map(cricleid => cricleid.cricleid);
    const select = await sql`SELECT * FROM Circle`;
    const selectids = select.map(el => el.cricleid);
    let results = [];
    for (const id of selectids) {
      const selectuser = await sql`SELECT 
      (SELECT COUNT(*) FROM Users WHERE IdCircle = ${id} AND Role = 2) AS UserCount,
      (SELECT QuantityUser FROM Circle WHERE CricleID = ${id}) AS CircleQuantity`;

      const userCount = selectuser[0].usercount || 0;

      results.push({
        cricleid: id,
        userCount: userCount
      });
    }
    const role = req.cookies.role;
    if (role == 1) {
      if (classNum.trim().length != 0) {
        select = select.filter(el => el.userclass == classNum)
      }
      if (maxPeople.length != 0) {
        select = select.filter(el => maxPeople.includes(`${el.quantityuser}`))
      }
      if (serch.trim().length != 0) {
        select = select.filter(el => el.namecricel.includes(serch.trim()))
      }
      const joinedCircles = select.filter(circle => circleIds.includes(circle.cricleid));
      const otherCircles = select.filter(circle => !circleIds.includes(circle.cricleid));
      const sortedCircles = joinedCircles.concat(otherCircles);


      select.forEach(item => {
        if (item.photopath) {
          item.photopath = item.photopath.replace('public/', '');
        }
      });

      try {
        const userCircles = await sql`
      SELECT c.NameCricel
      FROM Circle c
      INNER JOIN Users u ON c.CricleID = u.IdCircle
      WHERE u.UserId = ${req.cookies.userid}`;
        const namecricel = userCircles[0].namecricel;
        res.cookie('namecricel', namecricel, { maxAge: 9000000000, httpOnly: false });
        const aupdate = await sql`select creator from Users where UserId = ${req.cookies.userid}`;
        const result = aupdate[0].creator;
        res.cookie('idcircle', result, { maxAge: 9000000000, httpOnly: false })

      }
      catch (err) {
        console.log(err.message);
      }

      const circle = [];
      sortedCircles.forEach(el => {
        const matchingResult = results.find(result => result.cricleid === el.cricleid);
        if (matchingResult) {
          circle.push({
            cricleid: el.cricleid,
            namecricel: el.namecricel,
            quantityuser: el.quantityuser,
            userclass: el.userclass,
            photopath: el.photopath,
            descriptors: el.descriptors,
            userCount: matchingResult ? matchingResult.userCount : 0
          });
        } else {

        }
      });
      console.log(circle);
      res.send(circle)

    }
    else {
      let select = await sql`select * from Circle where userclass = ${classuser} and cricleid in ${sql([circleIds])}`
      if (classNum.trim().length != 0) {
        select = select.filter(el => el.userclass == classNum)
      }
      if (maxPeople.length != 0) {
        select = select.filter(el => maxPeople.includes(`${el.quantityuser}`))
      }
      if (serch.trim().length != 0) {
        select = select.filter(el => el.namecricel.includes(serch.trim()))
      }

      select.forEach(item => {
        if (item.photopath) {
          item.photopath = item.photopath.replace('public/', '');
        }
      });

      const circle = [];
      select.forEach(el => {
        const matchingResult = results.find(result => result.cricleid === el.cricleid);
        if (matchingResult) {
          circle.push({
            cricleid: el.cricleid,
            namecricel: el.namecricel,
            quantityuser: el.quantityuser,
            userclass: el.userclass,
            photopath: el.photopath,
            descriptors: el.descriptors,
            userCount: matchingResult ? matchingResult.userCount : 0
          });
        } else {

        }
      });
      res.send(circle)

    }
  }
  catch (err) {
    console.log(err.message)
  }

});
app.get('/SerchCricleBlock', async (req, res) => () => {
  select = req.cookies.result;
  res.send(select);

});

////////////////////////////////////////////////////Встуаление
app.post('/joincricle', async (req, res) => {

  const { id } = req.body;
  const selectuser = await sql`SELECT 
    (SELECT COUNT(*) FROM Users WHERE IdCircle = ${id} AND Role = 2) AS UserCount,
    (SELECT QuantityUser FROM Circle WHERE CricleID = ${id}) AS CircleQuantity`;

  if (selectuser[0].circlequantity > selectuser[0].usercount) {
    const numericId = parseInt(id, 10);
    const resultname = await sql`select NameCricel from Circle where CricleID = ${numericId}`;
    const user = await sql`select IdCircle from Users`
    const namecricel = resultname[0].namecricel;
    res.cookie('namecricel', namecricel, { maxAge: 9000000000, httpOnly: false });
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
  }
  else {
    res.status(400).json({ error: 'Кружок переполнен' });
  }

})

///////////////////////////////////////////////////////////Выход из кружка
app.patch('/outcricle', async (req, res) => {
  const result = await sql`update Users set IdCircle = ${null} where UserId = ${req.cookies.userid}`
  res.cookie('idcircle', null, { maxAge: 9000000000, httpOnly: false });
  res.send(result)

})

///////////////////////////////////////////////////////////Добовление дополнительной информации у кружка
app.post('/postdatacircle', async (req, res) => {
  try {
    const opisanie = req.body.opisanie;
    const creator = req.cookies.creator
    const currentDescriptor = await sql`SELECT Descriptors FROM Circle WHERE CricleID = ${creator}`;
    if (currentDescriptor && currentDescriptor.length > 0 && currentDescriptor[0].Descriptors === opisanie) {
      res.redirect('window/CricleLichKab.html');
    }
    await sql`UPDATE Circle SET Descriptors = ${opisanie} WHERE CricleID = ${creator}`
    res.redirect('window/CricleLichKab.html');
  }
  catch (error) {
    console.error('Error updating Circle:', error);
    res.status(500).send('Ошибка обновления описания круга');
  }
});

///////////////////////////////////////////////////////////Добовление дополнительной информации у кружка фото
app.post('/imgpostCircle', uploadCircle.single('photos'), async (req, res) => {
  const photoPath = req.file.path.replace(/\\/g, '/');

  try {
    const resulselect = await sql`SELECT photopath FROM Circle WHERE CricleID = ${req.cookies.creator}`;

    if (resulselect.length > 0) {
      const photoPathdel = resulselect[0].photopath;
      if (photoPathdel && photoPathdel !== '17116223670001.jpg') {
        try {
          await fs.promises.unlink(`${photoPathdel}`);
        } catch (err) {
          console.error('Error deleting file', err);
        }
      }
    }

    await sql`
          UPDATE Circle
          SET photopath = ${photoPath}
          WHERE CricleID = ${req.cookies.creator}
      `;

  }
  catch (error) {
    console.error(error);
  }

});

///////////////////////////////////////////////////////////Получение дополнительной информации у кружка картинки
app.get('/imggetCircle', async (req, res) => {

  try {
    const resulselect = await sql`select*from Circle where CricleID = ${req.cookies.idcircle}`;
    const datanew = resulselect.map(el => ({
      PhotoPathCircle: el.photopath.replace('public/', ''),
    }));
    res.send(datanew);
  } catch (error) {

  }
})

///////////////////////////////////////////////////////////Получение дополнительной информации у кружка описание
app.get('/desget', async (req, res) => {

  try {
    const result = await sql`SELECT Descriptors FROM Circle WHERE CricleID = ${req.cookies.idcircle}`;

    const descriptors = result[0].descriptors;
    // console.log(descriptors);
    res.json({ opisanie: descriptors })
  } catch (error) {
    console.error('Error getting Circle description:', error);

    res.status(500).send('Ошибка получения описания круга');
  }

})

///////////////////////////////////////////////////////////Получение дополнительной информации у кружка название
app.get('/namecirleget', async (req, res) => {
  try {
    const result = await sql`select NameCricel from Circle where CricleID = ${req.cookies.idcircle}`;
    const name = result[0].namecricel
    res.json({ name: name });
  }
  catch (error) {
    console.error('Error getting Circle description:', error);

    res.status(500).send('Ошибка получения названия');
  }
})

///////////////////////////////////////////////////////////Редактор кружка
app.get('/getsetingscircle', async (req, res) => {
  try {
    const select = await sql`Select*from Circle where CricleID = ${req.cookies.idcircle}`
    const intCir = await sql` SELECT I.InterestsId AS InterestID, I.Name AS InterestName FROM Interests AS I
  JOIN InterestsСircle AS IC ON I.InterestsId = IC.InterestsId
  JOIN Circle AS C ON IC.CricleID = C.CricleID
  WHERE C.CricleID = ${req.cookies.idcircle};`
    const interes = await sql`select*from Interests`
    const result = interes.map(el => {
      el.joined = intCir.find((item, index, array) => {
        if (item.interestid == el.interestsid) return true
      }) ? true : false
      return el
    })
    const circleData = select.map(el => {
      return {
        name: el.namecricel,
        class: el.userclass,
        users: el.quantityuser
      };
    });

    const interestData = intCir.map(el => {
      return {
        interestName: el.interestname,
        interestid: el.interestid
      };
    });
    const combinedData = {
      circle: circleData,
      interests: interestData,
      allInterests: result
    };
    res.json(combinedData);
  }
  catch (error) {
    console.error('Error getting Circle description:', error);
    res.status(500).send('Ошибка получения названия');
  }
});

///////////////////////////////////////////////////////////Редакторк кружка добовление интересов
app.post('/addInterestToCircle', async (req, res) => {
  try {
    const interestId = req.body.id;
    // console.log(interestId);
    const select = await sql`INSERT INTO InterestsСircle (CricleID, InterestsId) VALUES (${req.cookies.idcircle}, ${interestId})`;
    // console.log(select);
    res.send(select)


  } catch (error) {
    console.error('Error adding interest to circle:', error);
    res.status(500).send('Failed to add interest to circle');
  }
});

///////////////////////////////////////////////////////////Редакторк кружка удаление интересов
app.delete('/removeInterestToCircle', async (req, res) => {
  try {
    const interestId = req.body.id;
    // console.log(interestId);
    const select = await sql`DELETE FROM InterestsСircle WHERE CricleID = ${req.cookies.idcircle} and InterestsId = ${interestId}`;
    res.send(select)


  } catch (error) {
    console.error(error);
  }
});

///////////////////////////////////////////////////////////Редакторк кружка класс, количество людей, имя кружка
app.post('/editcircle', async (req, res) => {
  try {
    const name = req.body.name;
    const schoolClass = req.body.schoolClass;
    const counthuman = req.body.counthuman;
    console.log(name);
    const update = await sql`UPDATE Circle SET NameCricel = ${name}, QuantityUser = ${counthuman}, userclass = ${schoolClass} 
    WHERE CricleID = ${req.cookies.idcircle}`
    res.send(update);

  }
  catch (error) {
    console.error(error);
  }

});

///////////////////////////////////////////////////////////Редакторк кружка удаление кружка
app.delete('/deleteCircle', async (req, res) => {
  try {
    const idcretor = req.body.circleId;
    const idcircle = req.cookies.idcircle;
    if (idcretor == idcircle) {
      await sql`DELETE FROM interestsСircle WHERE CricleID = ${idcretor}`;
      await sql`DELETE FROM NewsCircle WHERE CricleID = ${idcretor}`;
      await sql`DELETE FROM Meetings WHERE CricleID = ${idcretor}`;
      await sql`DELETE FROM Circle WHERE CricleID = ${idcretor}`;
      await sql`UPDATE Users SET IdCircle = null, creator = null  WHERE UserId = ${req.cookies.userid}`;
      res.cookie('namecricel', 'j:null', { maxAge: 9000000000, httpOnly: false });
      res.cookie('idcircle', 'j:null', { maxAge: 9000000000, httpOnly: false });
      res.cookie('creator', 'j:null', { maxAge: 9000000000, httpOnly: false });
      res.status(200).send('OK');
    }
  } catch (err) {
    console.error("error" + err);
  }
})

///////////////////////////////////////////////////////////Создание новостей
app.post('/createNews', upload.array('photos', 10), async (req, res) => {
  const formData = req.body;
  const photos = req.files;
  const photoPaths = photos.map(photo => photo.path.replace(/\\/g, '/'));
  try {
    for (let i = 0; i < photoPaths.length; i++) {
      const photoPath = photoPaths[i];
      await sql`
        INSERT INTO News (Description, PhotoPath, UserID) 
        VALUES (${formData.mess}, ${photoPath}, ${req.cookies.userid})`;
      console.log(photoPath);
    }
    res.json({ success: true, redirectUrl: '/window/TwelfHerf.html' });

  } catch (err) {
    console.error('Error creating news', err);
    res.status(500).send(err.message);
  }
});
//////////////////////////////////////////////////////////Получения новостей
app.use('/upload', express.static('public'));
app.get('/getNews', async (req, res) => {
  try {
    const selectnews = await sql` SELECT News.*, Users.*
        FROM News
        JOIN Users ON News.UserID = Users.UserId
        ORDER BY News.creatednews DESC;`;
    // console.log(selectnews);
    const datanew = selectnews.map(news => {
      const dates = news.creatednews;
      const dateo = new Date(dates);
      const month = ('0' + (dateo.getMonth() + 1)).slice(-2);
      const day = ('0' + dateo.getDate()).slice(-2);
      const hours = ('0' + dateo.getHours()).slice(-2);
      const minutes = ('0' + dateo.getMinutes()).slice(-2);
      const formattedDateTime = `${day}/${month} ${hours}:${minutes}`;
      return {
        NewID: news.newid,
        Description: news.description,
        photopath: news.photopath.replace('public/', ''),
        UserID: news.userid,
        FIO: news.fio,
        date: formattedDateTime,
        photopathuser: news.photopathuser.replace('public/', '')
      };
    });
    res.json(datanew);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

///////////////////////////////////////////////////////////Создание новостей кружка
app.post('/createNewsCircle', uploadCircleNews.array('photos', 10), async (req, res) => {
  const formData = req.body;
  const photos = req.files;
  const photoPaths = photos.map(photo => photo.path.replace(/\\/g, '/'));

  try {
    for (let i = 0; i < photoPaths.length; i++) {
      const photoPath = photoPaths[i];
      console.log("-");

      await sql`
        INSERT INTO NewsCircle (Description, PhotoPathImg, CricleID ) 
        VALUES (${formData.mess}, ${photoPath}, ${req.cookies.idcircle})`;
      console.log(photoPaths);
    }
    res.json({ success: true, redirectUrl: '/window/CricleNews.html' });
  } catch (err) {
    console.error('Error creating news', err);
    res.status(500).send(err.message);
  }
});

//////////////////////////////////////////////////////////Получения новостей кружков
app.get('/getCircleNews', async (req, res) => {
  try {
    const selectnewsCircle = await sql` SELECT NewsCircle.*, Circle.*
    FROM NewsCircle
    JOIN Circle ON NewsCircle.CricleID = Circle.CricleID
    where Circle.CricleID = ${req.cookies.idcircle}
    ORDER BY NewsCircle.creatednews DESC ;`;
    const datanew = selectnewsCircle.map(news => {
      const dates = news.creatednews;
      const dateo = new Date(dates);
      const month = ('0' + (dateo.getMonth() + 1)).slice(-2);
      const day = ('0' + dateo.getDate()).slice(-2);
      const hours = ('0' + dateo.getHours()).slice(-2);
      const minutes = ('0' + dateo.getMinutes()).slice(-2);
      const formattedDateTime = `${day}/${month} ${hours}:${minutes}`;
      return {
        NewCircleID: news.newid,
        Description: news.description,
        photopath: news.photopathimg.replace('public/', ''),
        circleID: news.circleID,
        namecricel: news.namecricel,
        date: formattedDateTime,
        photopathCircle: news.photopath.replace('public/', '')
      };
    });
    res.json(datanew);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////Создание встреч
app.post('/CreateMetings', async (req, res) => {

  try {
    const heding = req.body.hedingMeen;
    const date = req.body.meetingDate;
    const time = req.body.meetingTime;
    const info = req.body.additiInfo;
    const select = await sql`select*from Meetings where eventdata = ${date} and  eventtime = ${time} and CricleID = ${req.cookies.idcircle}`
    if (select.length > 0) {
      console.log('err');
    }
    else {
      await sql`INSERT INTO Meetings (heading, eventdata, eventtime, AddiInfo, CricleID) 
      VALUES(${heding}, ${date}, ${time}, ${info}, ${req.cookies.idcircle})`;
    }
  }
  catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////Получение встреч
app.get('/getMeetings', async (req, res) => {
  try {
    const select = await sql`select*from Meetings  where CricleID = ${req.cookies.idcircle} ORDER BY creatednews DESC`

    const dataMeetn = select.map(el => {
      const date = new Date(el.eventdata).toLocaleDateString('ru-RU');
      const time = el.eventtime.substring(0, 5);
      const createt = new Date(el.creatednews).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' ' +
        new Date(el.creatednews).toLocaleDateString('ru-RU');
      return {
        heding: el.heading,
        date: date,
        time: time,
        addinfo: el.addiinfo,
        createt: createt
      }
    })
    res.json(dataMeetn);
  }
  catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

//////////////////////////////////////////////////////////Получение участников кружка
app.get('/getStudens', async (req, res) => {
  try {
    const select = await sql`select * from Users where IdCircle = ${req.cookies.idcircle} and ClassUser is not null`
    const dataStudens = select.map(el => {
      return {
        FIO: el.fio,
        ClassUser: el.classuser,
        photo: el.photopathuser.replace('public/', ''),
      }
    })
    res.json(dataStudens);


  }
  catch (error) {
    console.error(error.mess);
    res.status(500).send('Internal Server Error');

  }

});

//////////////////////////////////////////////////////////// Запуск сервака и создания таблиц
const start = async () => {
  await sql`CREATE TABLE if not exists secritKey(
    idSecritKey SERIAL PRIMARY KEY,
    Key VARCHAR(70) NOT NULL
  )`;

  await sql`CREATE TABLE if not exists Users (
    UserId SERIAL PRIMARY KEY,
    FIO VARCHAR(100) NOT NULL unique, 
    Email VARCHAR(70) NOT NULL unique,
    Tel VARCHAR(12) NOT NULL unique,
    ClassUser VARCHAR(2) NULL,
    PasswordHash VARCHAR(100) NOT NULL,
    Role int NOT NULL,
    IdCircle int null,
    PhotoPathUser TEXT NULL,
    creator int null,
    idSecritKey int references secritKey(idSecritKey) null,
    UNIQUE(idSecritKey)
  )`;




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
  await sql`CREATE TABLE if not exists Circle(
      CricleID SERIAL PRIMARY KEY,
      NameCricel varchar(50) NOT NULL unique,
      QuantityUser int NOT NULL,
      userclass varchar(2) NOT NULL,
      photopath text null,
      Descriptors varchar(1000) null
      ) `;

  await sql`CREATE TABLE if not exists InterestsСircle(
        СircleInterestId SERIAL PRIMARY KEY,
        CricleID INT REFERENCES Circle(CricleID),
        InterestsId INT REFERENCES Interests(InterestsId),
        UNIQUE(CricleID, InterestsId)
        ) `;

  await sql`CREATE TABLE if not exists News(
        NewID SERIAL PRIMARY KEY,
        Description varchar(2000) NOT NULL,
        PhotoPath text NULL,
        creatednews TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UserID int REFERENCES Users(UserId)
          ) `;
  await sql`CREATE TABLE if not exists NewsCircle(
        NewID SERIAL PRIMARY KEY,
        Description varchar(2000) NOT NULL,  
        PhotoPathImg text NULL, 
        creatednews TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CricleID int REFERENCES Circle(CricleID)
    ) `;
  await sql`CREATE TABLE if not exists Meetings(
      MeetingsID SERIAL PRIMARY KEY,
      heading varchar(100) NOT NULL,
      eventdata DATE NOT NULL,
      eventtime TIME NOT NULL, 
      AddiInfo varchar(200) null,
      creatednews TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CricleID int REFERENCES Circle(CricleID)
  ) `;

  // await sql `ALTER TABLE Meetings add `
  // await sql `ALTER TABLE NewsCircle RENAME COLUMN PhotoPath TO PhotoPathImg;`

  // await sql`INSERT INTO users (fio, email, tel ,PasswordHash, Role,PhotoPathUser )
  //       VALUES ('Махаури Влад Олегович', 'amir.azizov2015@mil.ru', '89619370939',1, 1, 'photoUser/17116223670001.jpg')`
  //  await sql`INSERT INTO users (fio, email, tel ,PasswordHash, Role,PhotoPathUser ) values 
  //     ('Иванов Иван Иванович', 'ivanov@example.com', '89001234567', 'passwordhash1', 1, 'photoUser/17116223670001.jpg'),
  //     ('Петров Петр Петрович', 'petrov@example.com', '89007654321', 'passwordhash2', 1, 'photoUser/17116223670001.jpg'),
  //     ('Сидоров Сидор Сидорович', 'sidorov@example.com', '89009876543', 'passwordhash3', 1, 'photoUser/17116223670001.jpg')`

  // await sql`INSERT INTO users (fio, email, tel ,PasswordHash, Role,PhotoPathUser, ClassUser ) values
  //   ('Кузнецова Анна Павловна', 'kuznetsova@example.com', '89003456789', 'passwordhash4', 2, 'photoUser/17116223670001.jpg', '6а'),
  //   ('Смирнов Алексей Михайлович', 'smirnov@example.com', '89002345678', 'passwordhash5', 2, 'photoUser/17116223670001.jpg', '6б'),
  //   ('Васильева Мария Ивановна', 'vasilieva@example.com', '89001239876', ' ', 2, 'photoUser/17116223670001.jpg', '6в'),
  //   ('Новиков Никита Сергеевич', 'novikov@example.com', '89005678901', 'passwordhash7', 2, 'photoUser/17116223670001.jpg', '6а'),
  //   ('Морозова Наталья Викторовна', 'morozova@example.com', '89006543210', 'passwordhash8', 2, 'photoUser/17116223670001.jpg', '6б'),
  //   ('Фёдоров Александр Дмитриевич', 'fedorov@example.com', '89007894561', 'passwordhash9', 2, 'photoUser/17116223670001.jpg', '6в'),
  //   ('Павлова Ольга Юрьевна', 'pavlova@example.com', '89009871234', 'passwordhash10', 2, 'photoUser/17116223670001.jpg', '6б');`
  // await sql`INSERT INTO users (fio, email, tel ,PasswordHash, Role,PhotoPathUser )
  //    VALUES ('Христофорома Татьяна Алексеивна', 'Hrist2015@mail.ru', '89619370990',1, 1, 'photoUser/17116223670001.jpg')`

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
  // ('Программирование')`
  // await sql`INSERT INTO secritKey (Key) VALUES
  // ('rkVib5TZqglgRzvwMuAXDFmuEY05zpwEGqLg6h4wpqWEZx8r8789yEYgHIp7kaMyz9mE7'),
  // ('5zMtItnRxJ5cG2rMO30RD89ljm9zlXeuj6JgjOSvqGWFt091GS5mQka3LkmNNHtjLjIL1'),
  // ('HX09RQJdlAu8dQWgZ320AeG33Rv2lLWCfUcB0nZPewfIxCEuCPfpXhBNTQaqLaIFV1Y8k'),
  // ('z402v5oPRQkWfQ9RwwENS5kw8Jd6FWZtVLJLVJQj2ojs7QfeREZaEyvfQLcj0UIqgN659'),
  // ('BdLYpvSgIGwvNRsZ3rNzJdVeLXj67WNco0FgbmgkSNjYbtwoiNPjhgR7pCmQaSvIUU9WX'),
  // ('EUCsRDoCSoSSShQpuoULIJQaGlQDEkMKA1rVkeD57FgwMS1ybkNFgTo5DN2Uav3ZyyCqz'),
  // ('nIj4lB53ya4BHu2aVncDqVmcduuJrCO4LJhjDgZp7oDtDNlETwkliEhuH9OlUKUwdFKru'),
  // ('m2toPTjWmAvNKasFyhjK9EJl3Xi0WwvLoAcV8sfRoJkBL4Vju4hhIG2ktXARt3xA2wcYy'),
  // ('sHWDTCP4g4nRAtCkzEP3WVkkRRA7fVnWxC7JA4MksmVoHOuXrqp3h45UniUBuNDGrjbUP'),
  // ('X7xN52HVbRGbJokF11A1FQSVuV0mSBKbjTmLljjiswlA2NQjxNl5kEEcKPWUpSwHytQUg')`

  app.get('/', (req, res) => {
    res.render('Index', { footer: 'footer' });
  });
  app.listen(port, () => {
    // console.log(`Сервер запущен  http://192.168.149.56:${port}/window/login.html`);
    console.log(`Сервер запущен  http://192.168.0.105:${port}/Index.html`);

  });
}
start()



