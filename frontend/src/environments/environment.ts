export const environment = {
    production: false,
    apiUrl: 'http://localhost:5000/api',
    endpoints: {
      auth: {
        login: '/auth/login',
        register: '/auth/register'
      },
      groups: 'groups',
      teachers: 'teachers',
      students: 'students',
      payments: 'payments',
      reports: 'reports',
      loads: 'loads'
    }
  };