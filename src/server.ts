import express, {Request, Response} from 'express'
import {queryFiles} from './queryFiles'

const PORT = 3000

async function queryHandler(req: Request, res: Response) {
	const body = req.body
	const query: string = body.query
	try {
		const queryResponse = await queryFiles(query)
		res.status(200).json(queryResponse)
	} catch (e) {
		console.error(e)
		res.status(422).end('ERROR')
	}
}

export function server() {
	const app = express()
	app.use(express.json())

	app.post('/query', queryHandler)

	app.listen(PORT, () => {
		console.log(`listening on port: ${PORT}`)
	})
}