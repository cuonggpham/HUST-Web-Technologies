import './StudentTable.css'

const StudentTable = ({ students, newStudentId, onEdit, onDelete }) => {
  if (students.length === 0) {
    return <p>Không tìm thấy học sinh nào phù hợp</p>
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      onDelete(id)
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Họ tên</th>
          <th>Tuổi</th>
          <th>Lớp</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr 
            key={student._id} 
            className={student._id === newStudentId ? 'highlight' : ''}
          >
            <td>{student.name}</td>
            <td>{student.age}</td>
            <td>{student.class}</td>
            <td>
              <button onClick={() => onEdit(student)}>Sửa</button>
              <button onClick={() => handleDelete(student._id)}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StudentTable
