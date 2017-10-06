// Service Application
var ServicesApplication = {
  servicesDropDown: $('select[name=services]'),
  subServicesDropDown: $('select[name=sub-services]'),
  inputControl: $('[class=form-control]'),
  servicesAndSubServices: [],
  form: document.querySelector('form#service-form'),

  initialize: function () {
    this.servicesAndSubServices = SubServices.value;
    this.setEvents();
  },

  setEvents: function () {
    this.form.elements.namedItem('service').addEventListener('change', this.onServiceChange.bind(this));
  },

  // START: event triggered methods goes here
  onServiceChange: function (ev) {
    var serviceId = parseInt(ev.currentTarget.value);
    this.getSubServicesById(serviceId);
  },
  // END: event triggered methods goes here

  getSubServicesById: function (serviceId) {
    serviceId--; // since an array starts from 0, decrease by one
    this.populateSubServices(this.servicesAndSubServices.services[serviceId].subServices);
  },

  populateSubServices: function (subServices) {
    this.form.elements.namedItem('subService').innerHTML = '';
    subServices.forEach(function (subService) {
      var text = document.createTextNode( subService.name );
      var option = document.createElement('option');
      option.setAttribute('value', subService.value);
      option.appendChild(text);
      this.form.elements.namedItem('subService').appendChild( option );
    }.bind(this))
  }
};


// once page is ready, initialize the application, binding "this" to itself
window.onload = ServicesApplication.initialize.bind(ServicesApplication);
