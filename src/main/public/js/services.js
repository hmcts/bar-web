(function ($) {

  'use strict';


  setTimeout(function () {

    var Service = {
      getServices: function () {
        return $.ajax({
          method: 'GET',
          url: '/posts/record/services'
        });
      }
    };

    var ServicesApplication = {
      servicesDropDown: $('select[name=services]'),
      subServicesDropDown: $('select[name=sub-services]'),
      inputControl: $('[class=form-control]'),

      init: function () {
        console.log('Application has started');
        this.setEvents();
      },

      setEvents: function () {
        this.servicesDropDown.on('change', this.onServiceChange.bind(this));
      },

      onServiceChange: function (ev) {
        var serviceId = parseInt($(ev.currentTarget).val());
        Service.getServices().then(function (response) {
          var self = this;
          response.forEach(function (service) {
            if (service.id === serviceId) {
              if (service.subServices.length) {
                self.subServicesDropDown.empty();
                self.onPopulateSubServices(service.subServices);
              }
            }
          });
        }.bind(this));
      },

      onPopulateSubServices: function (subServices) {
        subServices.forEach(function (option) {
          this.subServicesDropDown.append($('<option value="'+ option.id +'">' + option.name + '</option>'));
        }.bind(this))
      }
    };

    ServicesApplication.init();
  }, 1000);


})(jQuery);

