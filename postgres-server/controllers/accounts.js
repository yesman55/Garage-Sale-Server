const dbAccounts = require('../database/accounts')
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const secret = process.env.secret || 'this is a terrible secret'

module.exports = function (dbClient) {
  const accounts = {}
  const db = dbAccounts(dbClient)

  accounts.changePassword = async function (email, oldPassword, newPassword) {
    const passed = await accounts.checkLogin(email, oldPassword)
    if (!passed) {
      const err = Error('Incorrect email or password')
      err.statusCode = 400
      throw err
    }
    const password = await encrypt(newPassword)
    return db.updatePassword(email, password)
  }
  accounts.update = async function (email, name, phone) {
    return db.updateUser(email, name, phone)
  }

  accounts.createUser = async function (registerObj) {
    const user = await accounts.getUser(registerObj.email)
    if(user === null){
      const encryptedPass = await encrypt(registerObj.password)
      registerObj.password = encryptedPass
      return await db.createAccount(registerObj)
    }
    else{
      return false
    }
    
  }

  accounts.getUser = async function (email) {
    return await db.getUser(email)
  }

  accounts.login = async function (email, password) {
    const loginOk = await accounts.checkLogin(email, password)
    if (!loginOk) return null
    // await db.login(email)
    return await db.getUser(email)
  }
  accounts.checkLogin = async function (email, password) {
    const pass = await encrypt(password)
    return await db.checkLogin(email, pass)
  }

  accounts.logout = async function (email) {
    return db.logout(email)
  }

  accounts.addItem = async function (itemObj) {
    itemObj.date_added = Date.now()
    itemObj.sold = "false"
    itemObj.item_id = uuidv4()
    console.log('uuid ' + itemObj.item_id)
    const success = db.addItem(itemObj)
    if (success){
      return itemObj.item_id
    }
    else{
      return null
    }
  }
  accounts.sellItem = async function (item_id, buyer_id) {
    try {
      const seller_id = await db.findItem(item_id)
      console.log('this is the seller_id from controller ' + seller_id)
      const dateSold = Date.now()
      await db.modifyItemToSold(item_id)
      await db.addSoldItem(item_id, buyer_id, seller_id, dateSold)
    } catch (error) {
      console.log("error in sell items")
      console.log(error)
    }
    return true
  }
  accounts.getAllItems = async function () {
    try {
      const allItems = await db.getAllItems()
      return allItems
    } catch (error) {
      console.log('error log' + error)
    }
  }
  accounts.getUserItems = async function (userId) {
    try {
      const userItems = await db.getUserItems(userId)
      return userItems
    } catch (error) {
      console.log('error ', error)
    }
  }

  return accounts
}

function encrypt(password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, secret, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) return reject(err)
      resolve(derivedKey.toString('hex'))
    })
  })
}