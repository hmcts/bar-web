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
  errors: [],

  initialize: function () {
    this.hideErrors();
    this.servicesAndSubServices = SubServices.value;
    this.setEvents();
  },

  setEvents: function () {
    this.form.elements.namedItem('service').addEventListener('change', this.onServiceChange.bind(this));
    this.form.elements.namedItem('addToLog').addEventListener('click', this.onAddToLog.bind(this));
    this.form.elements.namedItem('paymentType').addEventListener('change', this.onPaymentTypeChange.bind(this));
  },

  // START: event triggered methods goes here
  onServiceChange: function (ev) {
    var serviceId = parseInt(ev.currentTarget.value);
    this.getSubServicesById(serviceId);
  },

  onAddToLog: function (ev) {
    ev.preventDefault();
    var data = this.obtainValuesFromFields(this.form.elements);
    ServicesAjax.postToAPI(data).then(function (response) {
      if (typeof response.data.validationErrors !== 'undefined') {
        this.errors = response.data.validationErrors;
      }

      if (this.errors.length > 0) {
        // render the errors
        this.renderErrors();
        return;
      }

      this.resetErrors();
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
    var template = _.template(document.getElementById('paymentType-' + paymentType.value).innerHTML);
    document.querySelector('.paymentType-option').innerHTML = template();

    this.hideErrors();
  },

  renderErrors: function () {
    this.errors.forEach(function (error) {
      console.log( error );
      this.toggleFormGroupItem( this.form.elements.namedItem( error.fieldName ).parentElement, error.message );
    }.bind(this));
  },


  // use sass / scss to handle this (but in the mean time, use JavaScript to handle this
  hideErrors: function () {
    this.form.querySelectorAll('.error-message').forEach(function (errorMessageDiv) {
      errorMessageDiv.style.display = 'none';
    });
  },

  resetErrors: function () {
    this.errors = [];
  },

  toggleFormGroupItem: function (formGroup, message) {
    formGroup.classList.add('form-group-error');
    var errorMessageElement = formGroup.querySelector('.error-message');
    errorMessageElement.innerHTML = this._ucFirst(message);
    errorMessageElement.style.display = 'block';
  },

  _ucFirst: function (message) {
    message = message.substring(0, 1).toUpperCase() + message.substr(1, message.length);
    return message;
  }
};


// once page is ready, initialize the application, binding "this" to itself
window.onload = ServicesApplication.initialize.bind(ServicesApplication);
