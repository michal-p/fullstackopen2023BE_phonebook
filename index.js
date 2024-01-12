const express = require('express')
const app = express()
const PORT = 3001

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

app.use(express.json())//Json parser
app.listen(PORT, () => {//Port
  console.log(`Server running on port ${PORT}`)
})
//Get persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
//Get info
app.get('/info', (request, response) => {
  response.send(
    `<div>Phonebook has info for ${persons.length} people.</div>
     <div>${new Date() }</div>
    `
    )
})
