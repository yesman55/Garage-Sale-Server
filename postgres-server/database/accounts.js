
module.exports = function (client) {
  const dbAccounts = {}

  dbAccounts.checkLogin = async function (email, password) {
    const { rowCount } = await client.query({
      text: 'SELECT * FROM users WHERE email = $1 AND password = $2',
      values: [ email, password ]
    })
    return rowCount > 0
  }

  dbAccounts.createAccount = async function (registerObj) {
    const { user_id, password, firstName, lastName, email, id_photo} = registerObj;
    const name = firstName + ' ' + lastName
    const validated = false;
    const { rowCount } = await client.query({
      text: 'INSERT INTO users (user_id, password, name, email, id_photo, validated) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [ user_id, password, name, email, id_photo, validated ]
    })
    return rowCount > 0
  }

  dbAccounts.getUser = async function (email) {
    const { rows } = await client.query({
      text: 'SELECT * FROM users WHERE email = $1',
      values: [ email ]
    })
    return rows[0] || null
  }
  dbAccounts.addItem = async function () {
    const {  rowCount  } = await client.query({
      text: 'INSERT INTO items (item_id, price, item_name, item_descr, date_added, user_id, area_code, sold, seller_ids) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: []
    })
    return rowCount > 0
  }
  dbAccounts.removeItem = async function () {
    const {  rowCount  } = await client.query({

    })
  }

  dbAccounts.login = async function (email) {
    // TODO: hook up to table that tracks logged in users
  }

  dbAccounts.logout = async function (email) {
    // TODO: hook up to table that tracks logged in users
  }

  dbAccounts.update = async function (email, name, phone) {
    const { rows } = await client.query({
      text: 'UPDATE profiles SET name = $1 AND phone = $2 WHERE email = $3',
      values: [ name, phone, email ]
    })
    return rows[0] || null
  }

  dbAccounts.updatePassword = async function (email, newPassword) {
    const { rowCount } = await client.query({
      text: 'UPDATE logins SET password = $1 WHERE email = $2',
      values: [ password, email ]
    })
    return rowCount > 0
  }

  return dbAccounts
}
