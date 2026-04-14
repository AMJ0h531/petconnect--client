// src/services/applicationService.js
import api from './api'

const applicationService = {
  submit:  (petId, message) =>
    api.post('/applications', { petId, message }),

  getMyApplications: () =>
    api.get('/applications/my'),

  // Admin/Shelter: approve or deny
  updateStatus: (applicationId, status) =>
    api.put(`/applications/${applicationId}/status`, { status }),
}

export default applicationService