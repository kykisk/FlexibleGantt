import { useState, useEffect } from 'react'
import axios from 'axios'

// Dynamic API URL based on current host
const getApiUrl = () => {
  const hostname = window.location.hostname
  return `http://${hostname}:6001/api`
}

export function useTasks() {
  const API_URL = getApiUrl()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/tasks`)
      setTasks(response.data.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message)
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      const updatedTask = { ...task, ...updates }

      await axios.put(`${API_URL}/tasks/${taskId}`, updatedTask)

      // Update local state
      setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t))
    } catch (err) {
      console.error('Error updating task:', err)
      alert('Failed to update task')
    }
  }

  return { tasks, setTasks, loading, error, fetchTasks, updateTask }
}
