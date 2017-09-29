(function ($) {

  'use strict';

  var ServicesApplication = {
    servicesDropDown: $('[name=services]'),
    subServicesDropDown: $('[name=sub-services]'),

    init: function () {
      console.log('Application has started');
      console.log( this );
      this.setEvents();
    },

    setEvents: function () {
      this.servicesDropDown.on('change', this.populateSubServices.bind(this));
    },

    populateSubServices: function (ev) {
      console.log( this );
      console.log( $(ev.currentTarget) );
    }
  };

  ServicesApplication.init();

})(jQuery);

