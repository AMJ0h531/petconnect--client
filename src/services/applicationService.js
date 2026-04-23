import { createApplication, listApplications, reviewApplication } from './mockStore'

const applicationService = {
  submit: async (petId, message) => ({
    data: createApplication({ petId, message }),
  }),

  getMyApplications: async () => ({
    data: listApplications({ currentUserOnly: true }),
  }),

  updateStatus: async (applicationId, status) => ({
    data: reviewApplication(applicationId, status),
  }),

  getAll: async () => ({
    data: listApplications(),
  }),
}

export default applicationService
