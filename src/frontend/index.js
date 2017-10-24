import { ServicesApplication } from './modules/post'

// once page is ready, initialize the application, binding "this" to itself (only if form loads)
if (document.getElementById('service-form')) {
  window.onload = ServicesApplication.initialize.bind(ServicesApplication)
}
