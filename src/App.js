import { useEffect, useState } from 'react'
import axios from 'axios'

import Person from './components/Person'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const addPerson = (event) => {
    event.preventDefault()

    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        let changedPersonObject = persons.find(person => person.name == newName)
        changedPersonObject = {...changedPersonObject, number: newNumber}
        console.log(changedPersonObject)
        personService
          .update(changedPersonObject.id, changedPersonObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== changedPersonObject.id ? person : returnedPerson))
            setNotification(`Updated ${returnedPerson.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 3000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
            setPersons(persons.filter(n => n.id !== changedPersonObject.id))
          })
      }
    } else {
        const personObject = {
          name: newName,
          number: newNumber,
          id: persons.length + 1
        }

        personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification(`Added ${personObject.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 3000)
          })
          .catch(error => {
            console.log(error.response.data.error)
            setErrorMessage(error.response.data.error)
          })
      }
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDelete = (deletedPerson) => {
    if (window.confirm(`Delete ${deletedPerson.name}?`)) {
      personService
        .destroy(deletedPerson.id)
        .then(returnedPerson => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        })
      }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} className="notification" />
      <Notification message={errorMessage} className="error" />
      <PersonFilter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      {personsToShow.map(person =>
        <Person key={person.id} person={person} onDelete={() => handleDelete(person)} />)}
    </div>
  );
}

export default App;
