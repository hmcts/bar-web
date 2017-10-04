// Service Application
var ServicesApplication = {
  servicesDropDown: $('select[name=services]'),
  subServicesDropDown: $('select[name=sub-services]'),
  inputControl: $('[class=form-control]'),
  servicesAndSubServices: [],

  initialize: function () {
    this.servicesAndSubServices = SubServices.value;
    this.setEvents();
  },

  setEvents: function () {
    this.servicesDropDown.on('change', this.onServiceChange.bind(this));
  },

  // START: event triggered methods goes here
  onServiceChange: function (ev) {
    var serviceId = parseInt($(ev.currentTarget).val());
    this.getSubServicesById(serviceId);
  },
  // END: event triggered methods goes here

  getSubServicesById: function (serviceId) {
    serviceId--; // since an array starts from 0, decrease by one
    this.populateSubServices(this.servicesAndSubServices.services[serviceId].subServices);
  },

  populateSubServices: function (subServices) {
    this.subServicesDropDown.empty();
    subServices.forEach(function (subService) {
      this.subServicesDropDown.append($('<option value="' + subService.id + '">' + subService.name + '</option>'));
    }.bind(this))
  }
};


// once page is ready, initialize the application, binding "this" to itself
$(document).ready(function () {
  ServicesApplication.initialize();
});
