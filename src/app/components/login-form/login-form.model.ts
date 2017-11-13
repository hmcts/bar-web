export class LoginFormModel {
	email: string
	passw: string

	constructor({email, passw}) {
		this.email = email
		this.passw = passw
	}
}