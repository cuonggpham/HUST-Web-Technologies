import './Notification.css'

const Notification = ({ message }) => {
  if (!message) return null

  return (
    <div className="notification success">
      {message}
    </div>
  )
}

export default Notification
