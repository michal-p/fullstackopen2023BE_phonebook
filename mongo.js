const mongoose = require('mongoose')
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url =
  `mongodb+srv://miso:${password}@fullstackopen2023-phone.osikgqs.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number
})
const Person = mongoose.model('Person', personSchema)
const listAllPeople = () => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, ' ' , person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if(process.argv.length === 3) {
  console.log('phonebook:');
  listAllPeople()
} else {
  const person = new Person({
    name: name,
    number: number,
    id: Math.floor(Math.random() * 10000)
  })
  
  person.save().then(result => {
    console.log('person saved! result: ', result)
    mongoose.connection.close()
  })
}
