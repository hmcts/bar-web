import * as express from 'express'


// export the express.Router object with defined routes
export default express.Router()


	.get('/', (request: express.Request, response: express.Response) => {
		
		response.render('bar/views/index', {
			title: 'BARS Project.',
			message: 'Hello World.'
		});
	})