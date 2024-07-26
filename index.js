const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('body', function( req,res ){ 
    if(req.method === "POST"){
        return JSON.stringify(req.body)
    }
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id:"1",
        name:"Arto Hellas",
        number:"040-000111"
    },
    {
        id:"2",
        name:"Ada Lovelace",
        number:"433321234"
    },
    {
        id:"3",
        name:"Dan Abramov",
        number:"11-111-11-111"
    },
    {
        id:"4",
        name:"Mary Poppendieck",
        number:"38-23-111344"
    }
]

app.get('/info', (request,response) => {
    const entryCount = persons.length
    const dateNow = Date()
    response.send(`Phonebook has info for ${entryCount} people <br>${dateNow}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    if(!newPerson.name || !newPerson.number){
        return response.status(400).json({
            error: 'name and/or number missing'
        })
    }
    if(persons.map(p => p.name).includes(newPerson.name)){
        return response.status(400).json({
            error: 'name already in use, name must be unique'
        })
    }
    newPerson.id = generateId()
  
    persons = persons.concat(newPerson)
  
    response.json(newPerson)
  })

const generateId = () => {
    return Math.floor(Math.random()*1000) + 5
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})