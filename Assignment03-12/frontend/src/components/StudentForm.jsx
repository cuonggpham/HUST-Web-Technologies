import { useState } from 'react'
import './StudentForm.css'

const StudentForm = ({ loading, onSubmit, editingStudent, onCancelEdit }) => {
  // Initialize with editing student data or empty
  const [formData, setFormData] = useState({
    name: editingStudent?.name || '',
    age: editingStudent?.age || '',
    class: editingStudent?.class || ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.age || !formData.class) return

    const studentData = {
      name: formData.name,
      age: Number(formData.age),
      class: formData.class
    }

    const result = await onSubmit(studentData)
    
    if (result.success && !editingStudent) {
      setFormData({ name: '', age: '', class: '' })
    } else if (!result.success) {
      alert('Thao tác thất bại: ' + result.error)
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', age: '', class: '' })
    onCancelEdit()
  }

  return (
    <form onSubmit={handleSubmit} className="add-student-form">
      <input
        type="text"
        placeholder="Họ tên"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Tuổi"
        value={formData.age}
        onChange={(e) => handleChange('age', e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Lớp"
        value={formData.class}
        onChange={(e) => handleChange('class', e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading 
          ? (editingStudent ? 'Đang cập nhật...' : 'Đang thêm...') 
          : (editingStudent ? 'Cập nhật' : 'Thêm học sinh')
        }
      </button>
      {editingStudent && (
        <button type="button" onClick={handleCancel}>Hủy</button>
      )}
    </form>
  )
}

export default StudentForm
