const express = require('express')
const app = express()
const fs = require('fs')
const port = 3000

const usersBuffer = fs.readFileSync('./users.json')
let users = JSON.parse(usersBuffer)
console.log(users)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('I work!')
})

app.get('/api/v1/users/', (req, res) => {
  res.send({
    data: users,
    message: "Successfully retrieved users",
    status: 'ok'
  })
})

app.get('/api/v1/users/:username/', (req, res) => {
  console.log('query: ', req.query)
  const {username} = req.params
  for (let user of users) {
    if (user.username === username) {
      return res.json({
        data: user,
        message: `Succesffuly retrieved data for user ${username}`,
        status: 'ok'
      })
    }
  }
  res.json({
    data: null,
    message: `Could not retrieve data for user ${username}`,
    status: 'not found'
  })
})

app.post('/api/v1/users/', (req, res) => {
  const {name, email, username} = req.body
  for (let user of users) {
    if (user.username === username || user.email === email) {
      return res.json({
        data: null,
        message: `Email or username is chosen!`,
        status: 'bad'
      })
    }
  }
  let user = {
    id: users.length+1, username, name, email
  }
  users.push(user)
  fs.writeFileSync('./users.json', JSON.stringify(users))
  res.status(201).json({
    data: user,
    message: `Succesffuly created data for user ${username}`,
    status: 'ok'
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})