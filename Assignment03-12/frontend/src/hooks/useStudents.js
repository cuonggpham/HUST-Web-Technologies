import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/students'

export const useStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState('')
  const [newStudentId, setNewStudentId] = useState(null)

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_URL)
      setStudents(res.data)
    } catch (error) {
      console.error('Lỗi khi fetch danh sách:', error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const showNotification = (message, studentId = null) => {
    setNotification(message)
    setNewStudentId(studentId)
    setTimeout(() => {
      setNotification('')
      setNewStudentId(null)
    }, 3000)
  }

  const addStudent = async (studentData) => {
    setLoading(true)
    try {
      const res = await axios.post(API_URL, studentData)
      setStudents((prev) => [...prev, res.data])
      showNotification('Thêm học sinh thành công!', res.data._id)
      return { success: true }
    } catch (err) {
      console.error('Lỗi:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || err.message 
      }
    } finally {
      setLoading(false)
    }
  }

  const updateStudent = async (id, studentData) => {
    setLoading(true)
    try {
      const res = await axios.put(`${API_URL}/${id}`, studentData)
      setStudents((prev) => prev.map((s) => s._id === id ? res.data : s))
      showNotification('Cập nhật học sinh thành công!')
      return { success: true }
    } catch (err) {
      console.error('Lỗi:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || err.message 
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setStudents((prev) => prev.filter((s) => s._id !== id))
      showNotification('Xóa học sinh thành công!')
      return { success: true }
    } catch (err) {
      console.error('Lỗi khi xóa:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || err.message 
      }
    }
  }

  return {
    students,
    loading,
    notification,
    newStudentId,
    addStudent,
    updateStudent,
    deleteStudent
  }
}
