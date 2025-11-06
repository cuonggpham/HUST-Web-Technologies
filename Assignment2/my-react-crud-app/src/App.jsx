import { useState } from 'react'
import './App.css'
import SearchForm from './components/SearchForm'
import AddUser from './components/AddUser'
import ResultTable from './components/ResultTable'

function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);

  return (
    <div>
      <h1>Quản lý người dùng</h1>
      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUser} />
      <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
    </div>
  )
}

export default App
