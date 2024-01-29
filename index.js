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
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)
//Get info
app.get('/info', (request, response) => {
  Person.find({})
    .then(people => {
      response.send(`<div>Phonebook has info for ${people.length} people.</div>
                     <div>${new Date()}</div>`)
    })
})
//Get persons
app.get('/api/persons', (request, response, next) => {
  //The code automatically uses the defined toJSON when formatting notes to the response.
  Person.find({})
  .then(people => response.json(people))
  .catch(error => next(error))
})
//Get single person entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => response.json(person))  // person ? response.json(person) : response.status(404).end()
    .catch(error => next(error))
})
//Delete single person entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log('DELETE result :', result);
      response.status(204).end()
    })
    .catch(error => next(error))
})

//Post create single person entry
app.post('/api/persons', (request, response, next) => {
  // console.log(request.headers) //print all of the request headers
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  } 

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)
  })

  person.save()
  .then(result => {
    console.log('person saved! result: ', result)
    response.json(result)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
  .then(updatedPerson => response.json(updatedPerson))
  .catch(error => next(error))
})

//Middle ware -> catching requests made to non-existent routes so we call it after our routes definitions
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') response.status(400).send({ error: 'malformatted id' })
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)
