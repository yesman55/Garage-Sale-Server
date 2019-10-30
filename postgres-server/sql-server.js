const express = require('express')
const bodyParser = require("body-parser");
const Accounts = require('./controllers/accounts')
const cors = require('cors')

module.exports = async function (dbClient, port = 0) {
  const app = express()
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors())

  const accounts = Accounts(dbClient)
  
  app.get('/', function(req, res) {
    res.sendStatus(200)
  });
  app.post('/users/authenticate', async (req, res) => {
    const { email, password } = req.body
    console.log(email + ' ' + password)
    const user = await accounts.login(email, password)
    if (user) {
      res.json(user)
    } else {
      res.sendStatus(400)
    }
  })

  app.post('/users/addItem', async (req, res) => {
    const {  item_name, item_descr, price, user_id, area_code, seller_id } = req.body
    console.log(item_name + ' ' + item_descr)
    const success = await accounts.addItem({  item_name, item_descr, price, user_id, area_code, seller_id })
    if(success){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(400)
    }
  })


  app.post('/change-password', async (req, res) => {
    // const { newPassword, oldPassword } = req.body
    // const user = req.user
    // const changed = await accounts.changePassword(user.email, oldPassword, newPassword)
    // if (changed) {
    //   res.sendStatus(200)
    // } else {
    //   res.status(400).send('Incorrect email or password')
    // }
  })
  
  app.post('/users/register', async (req, res) => {
    const { user_id, password, firstName, lastName, email, id_photo } = req.body;
    console.log(email + ' ' + password)
    const User = await accounts.createUser({ user_id, password, firstName, lastName, email, id_photo })
    if (User) {
      res.sendStatus(200)
    } else {
      res.sendStatus(400)
    }
  })

  return new Promise(function (resolve, reject) {
    const listener = app.listen(port, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve({
          port: listener.address().port,
          stop: () => {
            listener.close()
            console.log('Server stopped')
          }
        })
      }
    })
  })
}
