// src/services/authService.js
import api from './api'

const authService = {
  login:    (username, password) =>
    api.post('/auth/login',    { username, password }),

  register: (username, email, password, role = 'USER') =>
    api.post('/auth/register', { username, email, password, role }),
}

export default authService