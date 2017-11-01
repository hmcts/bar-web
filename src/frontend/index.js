import { ServicesApplication } from './modules/post'
import Vue from 'vue'
import AppComponent from './app/AppComponent.vue'

// once page is ready, initialize the application, binding "this" to itself (only if form loads)
if (document.getElementById('service-form')) {
  window.onload = ServicesApplication.initialize.bind(ServicesApplication)
}

if (document.getElementById('bar-webapp')) {
    new Vue({
      el: '#bar-webapp',
      render: h => h(AppComponent)
    })
}