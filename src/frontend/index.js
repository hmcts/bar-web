import { ServicesApplication } from './modules/post'

// once page is ready, initialize the application, binding "this" to itself
window.onload = ServicesApplication.initialize.bind(ServicesApplication)