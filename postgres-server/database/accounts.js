
module.exports = function (client) {
  const dbAccounts = {}

  dbAccounts.checkLogin = async function (email, password) {
    const { rowCount } = await client.query({
      text: 'SELECT * FROM users WHERE email = $2 AND password = $3',
      values: [ email, password ]
    })
    return rowCount > 0
  }

  dbAccounts.createAccount = async function (email, password, firstName, lastName, studentID, image) {
    const validated = false;
    const { rowCount } = await client.query({
      text: 'INSERT INTO users (studentID, email, password, firstName, lastName, image, validated) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [ studentID, email, password, firstName, lastName, image, validated]
    })
    return rowCount > 0
  }

  dbAccounts.getUser = async function (email) {
    const { rows } = await client.query({
      text: 'SELECT * FROM profiles WHERE email = $1',
      values: [ email ]
    })
    return rows[0] || null
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
