import { useState, useMemo } from 'react'
import { useStudents } from './hooks/useStudents'
import Notification from './components/Notification'
import StudentForm from './components/StudentForm'
import SearchBar from './components/SearchBar'
import StudentTable from './components/StudentTable'
import './App.css'

function App() {
  const { 
    students, 
    loading, 
    notification, 
    newStudentId, 
    addStudent, 
    updateStudent, 
    deleteStudent 
  } = useStudents()

  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortAsc, setSortAsc] = useState(true)

  const handleFormSubmit = async (studentData) => {
    if (editingStudent) {
      const result = await updateStudent(editingStudent._id, studentData)
      if (result.success) {
        setEditingStudent(null)
      }
      return result
    } else {
      return await addStudent(studentData)
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
  }

  const handleCancelEdit = () => {
    setEditingStudent(null)
  }

  const handleDelete = async (id) => {
    const result = await deleteStudent(id)
    if (!result.success) {
      alert('Xóa thất bại: ' + result.error)
    }
  }

  // Filter and sort students
  const displayedStudents = useMemo(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return [...filtered].sort((a, b) => {
      return sortAsc 
        ? a.name.localeCompare(b.name) // localeCompare for proper string 
        : b.name.localeCompare(a.name)
    })
  }, [students, searchTerm, sortAsc])

  const toggleSort = () => {
    setSortAsc(!sortAsc)
  }

  return (
    <>
      <h1>Danh sách học sinh</h1>

      <Notification message={notification} />

      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortAsc={sortAsc}
        onToggleSort={toggleSort}
      />

      <StudentForm 
        key={editingStudent?._id || 'new'}
        loading={loading}
        onSubmit={handleFormSubmit}
        editingStudent={editingStudent}
        onCancelEdit={handleCancelEdit}
      />

      {students.length === 0 ? (
        <p>Chưa có học sinh nào</p>
      ) : (
        <StudentTable 
          students={displayedStudents}
          newStudentId={newStudentId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}

export default App
