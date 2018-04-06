export class UserModel {
  courtId: string;
  email: string;
  forename: string;
  surname: string;
  password: string;
  roles: Array<string>;

  constructor(options: { courtId, email, forename, surname, password, roles }) {
    this.courtId = options.hasOwnProperty('courtId') ? options.courtId : '';
    this.email = options.hasOwnProperty('email') ? options.email : '';
    this.forename = options.hasOwnProperty('forename') ? options.forename : '';
    this.surname = options.hasOwnProperty('surname') ? options.surname : '';
    this.password = options.hasOwnProperty('password') ? options.password : '';
    this.roles = options.hasOwnProperty('roles') ? options.roles : '';
  }

  get type(): string {
    if (this.roles.includes('bar-delivery-manager')){
      return 'deliverymanager';
    } else if (this.roles.includes('bar-senior-clerk')) {
      return 'seniorfeeclerk';
    } else if (this.roles.includes('bar-fee-clerk')) {
      return 'feeclerk';
    } else if (this.roles.includes('bar-post-manager')) {
      return 'postclerk';
    } else {
      return '';
    }
  }

  get typeText(): string {
    if (this.roles.includes('bar-delivery-manager')){
      return 'Delivery Manager';
    } else if (this.roles.includes('bar-senior-clerk')) {
      return 'Senior Clerk';
    } else if (this.roles.includes('bar-fee-clerk')) {
      return 'Fee Clerk';
    } else if (this.roles.includes('bar-post-manager')) {
      return 'Post Clerk';
    } else {
      return '';
    }
  }

  get fullName(): string {
    return this.forename + " " + this.surname;
  }


}
