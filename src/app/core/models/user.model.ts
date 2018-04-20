export class UserModel {

  static TYPES = {
    deliverymanager: {
      type: 'deliverymanager',
      typeText: 'Delivery Manager'
    },
    seniorfeeclerk: {
      type: 'seniorfeeclerk',
      typeText: 'Senior Clerk'
    },
    feeclerk: {
      type: 'feeclerk',
      typeText: 'Fee Clerk'
    },
    postclerk: {
      type: 'postclerk',
      typeText: 'Post Clerk'
    },
    user: {
      type: 'user',
      typeText: 'User'
    }
  };
  id: number;
  courtId: string;
  email: string;
  forename: string;
  surname: string;
  password: string;
  roles: Array<string>;

  constructor(options: { courtId, email, forename, surname, password, roles, id }) {
    this.id = options.hasOwnProperty('id') ? options.id : '';
    this.courtId = options.hasOwnProperty('courtId') ? options.courtId : '';
    this.email = options.hasOwnProperty('email') ? options.email : '';
    this.forename = options.hasOwnProperty('forename') ? options.forename : '';
    this.surname = options.hasOwnProperty('surname') ? options.surname : '';
    this.password = options.hasOwnProperty('password') ? options.password : '';
    this.roles = options.hasOwnProperty('roles') ? options.roles : [];
  }

  private getType() {
    if (this.roles.indexOf('bar-delivery-manager') >= 0) {
      return UserModel.TYPES.deliverymanager;
    } else if (this.roles.indexOf('bar-senior-clerk') >= 0) {
      return UserModel.TYPES.seniorfeeclerk;
    } else if (this.roles.indexOf('bar-fee-clerk') >= 0) {
      return UserModel.TYPES.feeclerk;
    } else if (this.roles.indexOf('bar-post-clerk') >= 0) {
      return UserModel.TYPES.postclerk;
    } else {
      return UserModel.TYPES.user;
    }
  }

  /* using indexof because: https://stackoverflow.com/questions/40262797/
      in-jasmine-array-includes-does-not-work-must-be-replaced-by-other-functions?
      utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa */
  get type(): string {
    return this.getType().type;
  }

  get typeText(): string {
    return this.getType().typeText;
  }

  get fullName(): string {
    return this.forename + ' ' + this.surname;
  }


}
