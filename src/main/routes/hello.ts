import * as express from 'express'


// export the express.Router object with defined routes
export default express.Router()

	// Home URL
	.get('/hello', (req: express.Request, res: express.Response) => {
		
		
		// remember that "render" grabs file from "views/" folder or "features/" folder
		res.render('bar/views/hello', {
			title: 'BARS Project',
			message: 'hello every body'
		})
	})
