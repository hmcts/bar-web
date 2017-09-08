import * as express from 'express'


// export the express.Router object with defined routes
export default express.Router()

	// Home URL
	.get('/hello', (req: express.Request, res: express.Response) => {
		
		res.render('bar/views/hello', {
			title: 'BARS Project',
			message: 'hello every body'
		});
	})
