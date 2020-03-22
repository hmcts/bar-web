export class UserModel {

  static TYPES = {
    deliverymanager: {
      type: 'deliverymanager',
      typeText: 'Delivery Manager'
    },
    seniorfeeclerk: {
      type: 'seniorfeeclerk',
      typeText: 'Senior Fee Clerk'
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
  sub: string;
  given_name: string;
  family_name: string;
  password: string;
  roles: Array<string>;

  constructor(options: { courtId?, sub?, given_name?, family_name?, password?, roles?, id }) {
    this.id = options.hasOwnProperty('id') ? options.id : '';
    this.courtId = options.hasOwnProperty('courtId') ? options.courtId : '';
    this.sub = options.hasOwnProperty('sub') ? options.sub : '';
    this.given_name = options.hasOwnProperty('given_name') ? options.given_name : '';
    this.family_name = options.hasOwnProperty('family_name') ? options.family_name : '';
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
    return this.given_name + ' ' + this.family_name;
  }


}
