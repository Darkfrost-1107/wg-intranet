require("./src/utils/global.js")

const port = 4200

const {start} = require('./src/config/app.js')

start({
  port
})

// app.use(cors())

// app.use(bodyParser.json()) // for parsing application/json

// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/login', (req, res) => {
//   res.json({
//     user:"gab",
//     pass:"word"
//   })
// })

// app.post('/login', (req, res) => {
//   const body = req.body
//   console.log(body)
//   res.json({})
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })