require('dotenv').config()
const Person = require('./modules/person')
const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const cors = require('cors')
app.use(cors()) //cors middleware to allow cross origin resources to be fetche
app.use(express.static('dist')) //middleware to show static content from FE
app.use(express.json())//Json parser - middleware too(json-parser is taken into use before the requestLogger middleware, because otherwise request.body will not be initialized when the logger is executed!)
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//Middleware -> https://expressjs.com/en/guide/using-middleware.html
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

//Get persons
app.get('/api/persons', (request, response) => {
  //The code automatically uses the defined toJSON when formatting notes to the response.
  Person.find({}).then(people => response.json(people))
})
//Get info
app.get('/info', (request, response) => {
  response.send(
    `<div>Phonebook has info for ${persons.length} people.</div>
     <div>${new Date() }</div>
    `
    )
})
//Get single person entry
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
//Delete single person entry
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const isNameExist = (name) => !!persons.find(p => p.name === name)

//Post create single person entry
app.post('/api/persons', (request, response) => {
  // console.log(request.headers) //print all of the request headers
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  } 
  
  if (isNameExist(body.name)) return response.status(400).json({
    error: 'name must be unique'
  })

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)
  }

  persons = persons.concat(person)

  response.json(person)
})

//Middle ware -> catching requests made to non-existent routes so we call it after our routes definitions
// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }
// app.use(unknownEndpoint)
