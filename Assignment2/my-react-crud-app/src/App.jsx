import { useState } from 'react'
import './App.css'
import SearchForm from './components/SearchForm'
import AddUser from './components/AddUser'
import ResultTable from './components/ResultTable'

function App() {
  // State Lifting: App la component cha, quan ly state chung cho cac component con
  // useState de luu keyword tim kiem, duoc cap nhat tu SearchForm
  const [kw, setKeyword] = useState("");
  
  // useState de luu user moi duoc them tu AddUser
  const [newUser, setNewUser] = useState(null);

  return (
    <div>
      <h1>Quản lý người dùng</h1>
      {/* State Lifting: truyen ham setKeyword xuong SearchForm de nhan gia tri tim kiem */}
      <SearchForm onChangeValue={setKeyword} />
      
      {/* State Lifting: truyen ham setNewUser xuong AddUser de nhan user moi */}
      <AddUser onAdd={setNewUser} />
      
      {/* Truyen state kw va newUser xuong ResultTable de hien thi va xu ly */}
      <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
    </div>
  )
}

export default App
