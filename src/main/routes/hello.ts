import * as express from 'express'
import rq from 'client/request'


// export the express.Router object with defined routes
export default express.Router()

	// Home URL
	.get('/hello', (req: express.Request, res: express.Response) => {
		
		rq.get('http://localhost:8080/hello').then(response => {
			// remember that "render" grabs file from "views/" folder or "features/" folder
			res.render('bar/views/hello', {
				title: 'BARS Project',
				message: response
			})
		})
		.catch(response => {
			// remember that "render" grabs file from "views/" folder or "features/" folder
			res.render('bar/views/hello', {
				title: 'BARS Project',
				message: 'Unable to get data from API.'
			})
		})
		
	})
