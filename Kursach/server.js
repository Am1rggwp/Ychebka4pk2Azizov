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
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 8189;
// module.exports = app;



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(json())
app.use(cookieParser());
app.use(cors())


const setCookie = (res, name, value) => {
  res.cookie(name, value, { maxAge: 9000000000, httpOnly: false });
};
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
    const rolenamesql = await sql`select namerole from role where roleid = ${roleid}`;

    console.log(rolenamesql);
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
      res.cookie('creator', result.creator, { maxAge: 9000000000, httpOnly: false });
      res.cookie('namecricel', '-', { maxAge: 9000000000, httpOnly: false });
      res.redirect('/window/hiwin.html');
    } else { }

  } catch (err) {
    console.error('Error authenticating user', err);
    res.status(500).send(err.message);
  }


});




////////////////////////////////////////////////////////// Выход
app.get('/out', async (req, res) => {
  res.clearCookie()
  res.send(200)
})


////////////////////////////////////////////////////// Профиль
app.get('/interes', async (req, res) => {

  const interes = await sql`select * from Interests `
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


/////////////////////////////////////////////////////////////////Аватарки 
app.get('/imgUser', async (req, res) => {

  try {
    const resulselect = await sql`select*from Users where UserId = ${req.cookies.userid}`;
    const datanew = resulselect.map(el => ({
      PhotoPathUser: el.photopathuser.replace('public/', ''),
    }));
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
      console.log(photoPathdel);
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

    res.send('Фотография успешно загружена');
  } catch (err) {
    console.error('Error uploading photo', err);
    res.status(500).send(err.message);
  }
});





////////////////////////////////////////////////////////////регистрация
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
        INSERT INTO users (fio, email, tel, ClassUser ,PasswordHash, Role, PhotoPathUser )
        VALUES (${name}, ${email}, ${tel},${classUser} ,${password}, 2, 'photoUser/17116223670001.jpg')
      `;
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

///////////////////////////////////////////////////////////// Создания куржка
app.post('/createCricle', async (req, res) => {
  const name = req.body.name;
  const ClassUsers = req.body.schoolClass;
  const quantitu = req.body.counthuman;
  const interesactive = req.body.activeIntereses;
  // console.log(quantitu)
  const Circle = await sql`select * from Circle where namecricel = ${name}`;
  try {
    if (Circle.length > 0) {
      res.redirect('window/windowError/CreateCircleError.html');
    } else {
      const insert = await sql`
        INSERT INTO Circle (NameCricel, QuantityUser, userclass, photopath )
        VALUES (${name},${quantitu},${ClassUsers},'public/photoCircle/defaltcircle.jpg')
      `;
      const criclecreat = await sql`select CricleID from Circle where namecricel = ${name}`;
      const cricleID = criclecreat[0].cricleid;
      for (const interestId of interesactive) {
        await sql`
          INSERT INTO InterestsСircle (CricleID, InterestsId)
          VALUES (${cricleID}, ${interestId})
        `;
      }
      await sql`UPDATE Users SET creator = ${cricleID}, IdCircle = ${cricleID} 
      where UserId = ${req.cookies.userid}`
      const aupdate = await sql`select creator from Users where UserId = ${req.cookies.userid}`;
      const result = aupdate[0].creator;
      res.cookie('creator', result, { maxAge: 9000000000, httpOnly: false }).sendStatus(200);

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
  const circleIds = matchingCircles.map(cricleid => cricleid.cricleid);
  const role = req.cookies.role;
  if (role == 1) {
    let select = await sql`select * from Circle`

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
    catch { }
    res.send(sortedCircles)
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

    res.send(select)
    // console.log(sortedCircles);

  }

});
app.get('/SerchCricleBlock', async (req, res) => () => {
  select = req.cookies.result;
  res.send(select);

});
////////////////////////////////////////////////////Встуаление
app.post('/joincricle', async (req, res) => {

  const { id } = req.body;
  const numericId = parseInt(id, 10);
  const resultname = await sql`select NameCricel from Circle where CricleID = ${numericId}`;
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
      await sql`DELETE FROM Circle WHERE CricleID = ${idcretor}`;
      await sql`UPDATE Users SET IdCircle = null, creator =null  WHERE UserId = ${req.cookies.userid}`;
      res.cookie('namecricel', 'j:null', { maxAge: 9000000000, httpOnly: false });
      res.cookie('idcircle', 'j:null', { maxAge: 9000000000, httpOnly: false });
      res.cookie('creator', 'j:null', { maxAge: 9000000000, httpOnly: false });
      res.send(200);
    }
  } catch(err) {
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
    }
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
      console.log(photoPath);
      await sql`
        INSERT INTO NewsCircle (Description, PhotoPathImg, CricleID ) 
        VALUES (${formData.mess}, ${photoPath}, ${req.cookies.idcircle})`;
    }
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
    IdCircle int null,
    PhotoPathUser TEXT NULL,
    creator int null
    )`;
  // await sql` ALTER TABLE Сircle
  // ALTER COLUMN Descriptors TYPE  varchar(1000);`
  // await sql `ALTER TABLE Users add `
  // await sql`UPDATE Users
  // SET creator = 10
  // WHERE UserId = 2`
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
  // ('Программирование')`;

  app.listen(port, () => {
    console.log(`Сервер запущен  http://192.168.149.56:${port}/window/login.html`);
    // console.log(`Сервер запущен  http://192.168.0.108:${port}/Index.html`);

  });

}

start()



