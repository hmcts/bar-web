import axios from 'axios'

var ServicesAjax = {
  postToAPI: function (data) {
    if (typeof data === 'undefined')
    data = {};
    
    return axios.post('', data)
  }
};

var ServicesApplication = {
  servicesAndSubServices: [],
  tableBody: document.getElementById('table-body'),
  form: document.querySelector('form#service-form'),
  paymentOptionsContainer: document.querySelector('.paymentType-option'),
  errors: [],

  initialize: function () {
    document.getElementById('cash-details').style.display = 'none';
    this.servicesAndSubServices = JSON.parse(document.querySelector('[name=sub-services-dump]').value);
    this.hideErrors();
    this.setEvents();
  },

  setEvents: function () {
    this.form.elements.namedItem('service').addEventListener('change', this.onServiceChange.bind(this));
    this.form.elements.namedItem('add_to_log').addEventListener('click', this.onAddToLog.bind(this));
    this.form.elements.namedItem('payment_type').addEventListener('change', this.onPaymentTypeChange.bind(this));
  },

  // START: event triggered methods goes here
  onServiceChange: function (ev) {
    var serviceId = parseInt(ev.currentTarget.value)
    this.getSubServicesById(serviceId)
  },

  onAddToLog: function (ev) {
    ev.preventDefault()
    var formData = this.obtainValuesFromFields(this.form.elements)
    ServicesAjax.postToAPI(formData).then(function (response) {
      if (typeof response.data.validationErrors !== 'undefined') this.errors = response.data.validationErrors
      if (this.errors.length > 0) { this.renderErrors(); }
      else { this.hideErrors(); this.resetErrors(); this.appendPaymentToTable(response.data.model); }
    }.bind(this))
  },

  onPaymentTypeChange: function (ev) {
    // this.togglePaymentDisplay(); -- this has been purposely commented out for demo purposes
    switch (ev.currentTarget.value) {
      case "1":
        document.getElementById('cheque-details').style.display = 'block';
        document.getElementById('cash-details').style.display = 'none';
      break;
      case "2":
        document.getElementById('cheque-details').style.display = 'none';
        document.getElementById('cash-details').style.display = 'block';
      break;
    }
  },
  // END: event triggered methods goes here

  appendPaymentToTable: function (data) {
    var sort_code = data.sort_code.split('')
    sort_code = sort_code.map((value, index) => {
      if (index === 1 || index === 3) {
        return value + '-';
      }
      return value;
    });
    data.sort_code = sort_code.join('');
    data.amount = (data.amount / 100);
    var currency = '&pound;';
    if (data.currency === 'EUR') {
      currency = '&euro;'
    }

    // create the columns
    let idColumn = this._createElement('td', 'ZX00' + document.querySelectorAll('tbody tr').length);
    let payeeNameColumn = this._createElement('td', data.payee_name);
    let subserveColumn = this._createElement('td', data.cases[0].sub_service.name);
    let paymentTypeColumn = this._createElement('td', data.payment_type.name);
    let sortCodeColumn = this._createElement('td', ((data.sort_code === '00-00-00') ? '-' : data.sort_code));
    let accountNumberColumn = this._createElement('td', ((data.account_number === '00000000') ? '-' : data.account_number));
    let chequeNumberColumn = this._createElement('td', ((data.cheque_number === '000000') ? '-' : data.cheque_number));
    let amountColumn = this._createElement('td', currency + data.amount.toFixed(2));
    let draftColumn = this._createElement('td', 'Draft');

    // create the table row
    let tableRow = this._createElement('tr');
    
    // append columns to row
    tableRow.appendChild(idColumn);
    tableRow.appendChild(payeeNameColumn);
    tableRow.appendChild(subserveColumn);
    tableRow.appendChild(paymentTypeColumn);
    tableRow.appendChild(sortCodeColumn);
    tableRow.appendChild(accountNumberColumn);
    tableRow.appendChild(chequeNumberColumn);
    tableRow.appendChild(amountColumn);
    tableRow.appendChild(draftColumn);

    this.tableBody.appendChild( tableRow )
  },

  getSubServicesById: function (serviceId) {
    serviceId--; // since an array starts from 0, decrease by one
    this.populateSubServices(this.servicesAndSubServices.services[serviceId].subServices);
  },

  obtainValuesFromFields: function (elements) {
    var data = {};
    var numberOfElements = elements.length;
    for (var i = 0; i < numberOfElements; i++) {
      var elementName = elements[i].getAttribute('name');
      if (elementName !== 'add_to_log' && elementName !== 'sub-services-dump') {
        data[elementName] = elements[i].value;
      }
    }
    return data;
  },
  
  renderErrors: function () {
    this.hideErrors();
    this.errors.forEach(function (error) {
      this.toggleFormGroupItem(this.form.elements.namedItem(error.property).parentElement, error.constraints);
    }.bind(this));
  },

  populateSubServices: function (subServices) {
    this.form.elements.namedItem('sub_service').innerHTML = '';
    subServices.forEach(function (subService) {
      var text = document.createTextNode(subService.name);
      var option = document.createElement('option');
      option.setAttribute('value', subService.id);
      option.appendChild(text);
      this.form.elements.namedItem('sub_service').appendChild(option);
    }.bind(this))
  },

  togglePaymentDisplay: function () {
    var paymentType = this.form.elements.namedItem('paymentType');
    var template = _.template(document.getElementById('paymentType-' + payment_type.value).innerHTML);
    this.paymentOptionsContainer.innerHTML = template();
    this.hideErrors();
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
    errorMessageElement.innerHTML = this._ucFirst(errorString.join('<br />'));
    errorMessageElement.style.display = 'block';
  },

  _ucFirst: function (message) {
    message = message.substring(0, 1).toUpperCase() + message.substr(1, message.length);
    return message;
  },

  _createElement: function (tag, text) {
    if (typeof text === 'undefined') text = '';
    let element = document.createElement(tag);
    element.innerHTML = text;
    return element;
  }
};

export {
  ServicesApplication,
  ServicesAjax
}