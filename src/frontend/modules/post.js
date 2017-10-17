import axios from 'axios'
import _ from 'lodash'

// Service Application

var ServicesAjax = {
  postToAPI: function (data) {
    if (typeof data === 'undefined')
      data = {};

    return axios.post('', data)
  }
};


var ServicesApplication = {
  servicesAndSubServices: [],
  form: document.querySelector('form#service-form'),
  paymentOptionsContainer: document.querySelector('.paymentType-option'),
  errors: [],

  initialize: function () {
    this.hideErrors();
    this.servicesAndSubServices = SubServices.value;
    this.setEvents();
  },

  setEvents: function () {
    this.form.elements.namedItem('service').addEventListener('change', this.onServiceChange.bind(this));
    this.form.elements.namedItem('add_to_log').addEventListener('click', this.onAddToLog.bind(this));
    this.form.elements.namedItem('payment_type').addEventListener('change', this.onPaymentTypeChange.bind(this));
  },

  // START: event triggered methods goes here
  onServiceChange: function (ev) {
    var serviceId = parseInt(ev.currentTarget.value);
    this.getSubServicesById(serviceId);
  },

  onAddToLog: function (ev) {
    ev.preventDefault();
    var formData = this.obtainValuesFromFields(this.form.elements);
    ServicesAjax.postToAPI(formData).then(function (response) {
      if (typeof response.data.validationErrors !== 'undefined') this.errors = response.data.validationErrors;
      if (this.errors.length > 0) { this.renderErrors(); return }
      else { this.resetErrors(); }
    }.bind(this));
  },

  onPaymentTypeChange: function () {
    this.togglePaymentDisplay();
  },
  // END: event triggered methods goes here

  getSubServicesById: function (serviceId) {
    serviceId--; // since an array starts from 0, decrease by one
    this.populateSubServices(this.servicesAndSubServices.services[serviceId].subServices);
  },

  obtainValuesFromFields: function (elements) {
    var data = {};
    data.caseReference = '';
    var numberOfElements = elements.length;
    for (var i = 0; i < numberOfElements; i++) {
      var elementName = elements[i].getAttribute('name');
      if (elementName !== 'addToLog') {
        data[elementName] = elements[i].value;
      }
    }
    return data;
  },

  populateSubServices: function (subServices) {
    this.form.elements.namedItem('subService').innerHTML = '';
    subServices.forEach(function (subService) {
      var text = document.createTextNode(subService.name);
      var option = document.createElement('option');
      option.setAttribute('value', subService.value);
      option.appendChild(text);
      this.form.elements.namedItem('subService').appendChild(option);
    }.bind(this))
  },

  togglePaymentDisplay: function () {
    var paymentType = this.form.elements.namedItem('paymentType');
    var template = _.template(document.getElementById('paymentType-' + payment_type.value).innerHTML);
    this.paymentOptionsContainer.innerHTML = template();
    this.hideErrors();
  },

  renderErrors: function () {
    this.errors.forEach(function (error) {
      this.toggleFormGroupItem(this.form.elements.namedItem(error.property).parentElement, error.constraints);
    }.bind(this));
  },


  // use sass / scss to handle this (but in the mean time, use JavaScript to handle this
  hideErrors: function () {
    this.form.querySelectorAll('span.error-message').forEach(function (errorMessageDiv) {
      errorMessageDiv.parentElement.classList.remove('form-group-error');
      errorMessageDiv.style.display = 'none';
    });
  },

  resetErrors: function () {
    this.hideErrors();
    this.errors = [];
  },

  toggleFormGroupItem: function (formGroup, constraints) {
    var errorString = [];
    for (var message in constraints) {
      errorString.push(constraints[message]);
    }

    formGroup.classList.add('form-group-error');
    var errorMessageElement = formGroup.querySelector('.error-message');
    errorMessageElement.innerHTML = this._ucFirst(errorString.join('</p><p>'));
    errorMessageElement.style.display = 'block';
  },

  _ucFirst: function (message) {
    message = message.substring(0, 1).toUpperCase() + message.substr(1, message.length);
    return message;
  }
};


export {
  ServicesApplication,
  ServicesAjax
}