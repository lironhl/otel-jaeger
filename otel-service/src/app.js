const { init } = require('./tracing')
const { PORT } = require('./consts')
const api = require('@opentelemetry/api')
const express = require('express')
const axios = require('axios')

const app = express()
const { tracer } = init('demo-node-service', 'development')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/hello', async (req, res) => {
	const sp = tracer.startSpan("my span")
	const apiResponse = await axios.get('https://randomuser.me/api/')
	sp.addEvent('Hello API Called', { randomIndex: 1 })
	sp.end()


	res.status(200).send({
		success: true,
		result: apiResponse.data,
	})
})

app.listen(PORT, (req, res) => {
	console.log('server started')
})