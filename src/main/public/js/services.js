(function ($) {

  'use strict';


  setTimeout(function () {

    // Services Service
    var Service = {
      getSubServiceByServiceId: function () {
        return $.ajax({
          method: 'GET',
          url: '/posts/record/services'
        });
      },
      getServicesAndSubServices: function () {
        return $.ajax({
          method: 'GET',
          url: '/posts/record/services'
        });
      }
    };

    // Service Application
    var ServicesApplication = {
      servicesDropDown: $('select[name=services]'),
      subServicesDropDown: $('select[name=sub-services]'),
      inputControl: $('[class=form-control]'),
      servicesAndSubServices: [],

      init: function () {
        this.loadServicesAndSubServices();
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

      loadServicesAndSubServices: function () {
        Service.getServicesAndSubServices().then(function (response) {
          this.servicesAndSubServices = response;
        }.bind(this));
      },

      getSubServicesById: function (serviceId) {
        serviceId--; // since an array starts from 0, decrease by one
        if (this.servicesAndSubServices.length < 1) {
          Service.getSubServiceByServiceId(serviceId).then(function (response) {
            this.populateSubServices(response[serviceId].subServices);
          }.bind(this));
          return;
        }

        this.populateSubServices(this.servicesAndSubServices[serviceId].subServices);
      },

      populateSubServices: function (subServices) {
        this.subServicesDropDown.empty();
        subServices.forEach(function (subService) {
          this.subServicesDropDown.append( $('<option value="'+subService.id+'">'+subService.name+'</option>') );
        }.bind(this))
      }
    };

    // instantiate the app
    ServicesApplication.init();

  }, 1500);


})(jQuery);

