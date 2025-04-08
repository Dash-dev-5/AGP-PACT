import { cities } from 'data/location';

export const endpoints = {
  complainant: {
    main: '/users/complainant'
  },
  complaint: {
    main: '/complaints'
  },
  complaintType: {
    main: '/complaint-type'
  }, 
  incidentCause: {
    main: '/activities'
  },
  prejudice: {
    main: '/prejudices'
  },
  repairRequest: {
    main: '/requested-repair-type'
  },
  responsibleEntity: {
    main: '/responsible-entity'
  },
  vulnerability: {
    main: '/vulnerability-level'
  },
  provinces: {
    get: '/provinces',
    create: '/provinces',
    update: (id: string) => `/provinces/${id}`,
    delete: (id: string) => `/provinces/${id}`
  },
  cities: {
    getByProvince: (id: string) => `/cities/provinces/${id}`,
    update: (id: string) => `/cities/${id}`,
    delete: (id: string) => `/cities/${id}`,
    create: '/cities'
  },
  profession: {
    get: '/professions'
  },
  projectSite: { main: '/project-site' }
};
