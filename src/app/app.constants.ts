
const footerDataNavigation = {
    items: [
      { internal: true, text: 'Cookies', href: '/cookies', target: '' },
      { internal: true, text: 'Accessibility Statement', href: '/accessibility', target: '' },
      { internal: false, text: 'Privacy policy', href: 'https://hmcts-access.service.gov.uk/privacy-policy', target: '_blank' },
      { internal: false, text: 'Terms and conditions', href: 'https://hmcts-access.service.gov.uk/terms-and-conditions', target: '_blank' },
      { internal: false, text: 'Contact us', href: 'https://hmcts-access.service.gov.uk/contact-us', target: '_blank' }
    ]
};

export class AppConstants {
    public static readonly FOOTER_DATA_NAVIGATION = footerDataNavigation;
}