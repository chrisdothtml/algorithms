const express = require('express')

const PORT = 1337
const server = express()

server.use(express.static('.'))
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
