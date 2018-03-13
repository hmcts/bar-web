export class UserModel {
  courtId: string;
  email: string;
  fullName: string;
  password: string;
  type: string;
  typeText: string;

  constructor(options: { courtId, email, fullName, password, type, typeText }) {
    this.courtId = options.hasOwnProperty('courtId') ? options.courtId : '';
    this.email = options.hasOwnProperty('email') ? options.email : '';
    this.fullName = options.hasOwnProperty('fullName') ? options.fullName : '';
    this.password = options.hasOwnProperty('password') ? options.password : '';
    this.type = options.hasOwnProperty('type') ? options.type : '';
    this.typeText = options.hasOwnProperty('typeText') ? options.typeText : '';
  }
}
