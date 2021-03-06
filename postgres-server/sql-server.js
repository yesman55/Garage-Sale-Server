const express = require('express')
const bodyParser = require("body-parser");
const Accounts = require('./controllers/accounts')
const cors = require('cors')

module.exports = async function (dbClient, port = 0) {
  const app = express()
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cors())

  const accounts = Accounts(dbClient)

  app.get('/', function (req, res) {
    res.sendStatus(200)
  });

  app.post('/users/authenticate', async (req, res) => {
    const {
      email,
      password
    } = req.body
    const user = await accounts.login(email, password)
    if (user) {
      //console.log(user)
      res.json(user)
    } else {
      res.sendStatus(400)
    }
  })

  app.post('/users/addItem', async (req, res) => {
    const {  item_name, item_descr, price, userId, area_code, seller_id } = req.body
    //console.log(item_name + ' ' + item_descr)
    const item_id = await accounts.addItem({  item_name, item_descr, price, userId, area_code, seller_id })
    if (item_id != null) {
      returnObj = {"Msg":"Success", "item_id":item_id} 
      res.send(returnObj)
    } else {
      res.sendStatus(400)
    }
  })
  app.post('/users/sellItem', async (req, res) => {
    const { item_id, buyer_id } = req.body
    //console.log('selling item id is ' + item_id)
    const Success = await accounts.sellItem(item_id, buyer_id)
    if(Success){
      res.status(200).send({msg: "item sold"})
    }
    else{
      res.status(400).send({msg: "error in selling"})
    }
  })

  app.get('/users/getAllItems', async (req, res) => {
    const allItems = await accounts.getAllItems()
    // console.log(allItems, typeof allItems);
    if(allItems != null){
      res.send(allItems)
    }
    else{
      res.sendStatus(400)
    }
  })

  app.get('/users/getItemsById/:userId', async (req, res) => {
    const userId = req.params.userId
    const userItems = await accounts.getUserItems(userId)
    if(userItems != null){
      res.send(userItems)
    }
    else{
      res.sendStatus(400)
    }
  })

  app.get('/users/getUserInfo/:userId', async (req, res) => {
    const userId = req.params.userId
    const userInfo = await accounts.getUserInfo(userId)
    if(userInfo != null){
      res.status(200).send(userInfo)
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
    const {
      userId,
      password,
      firstName,
      lastName,
      email,
      id_photo
    } = req.body;
    const User = await accounts.createUser({
      userId,
      password,
      firstName,
      lastName,
      email,
      id_photo
    })
    if (User) {
      res.status(200).send({msg: "user created" })
    } else {
      res.status(400).send({msg: "user already exist"})
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