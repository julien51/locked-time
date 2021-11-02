const express = require('express')
const cookieParser = require('cookie-parser')
const zones = require('./zones')

const app = express()
const port = process.env.PORT || 3000;

app.use(cookieParser())

const dateInZone = (zone) => {
  const d = new Date();
  const city = (zone.split("/")[1]).replace('_', ' ')
  return `${d.toLocaleString('en-US', { timeZone: zone })} in ${city}`
}

app.get('/', (req, res) => {
  res.send(`<h1>World Clocks</h1>
  <p>It is now: </p>
  <ul>
  <li>${dateInZone("Asia/Tokyo")}</li>
  <li>${dateInZone("Asia/Kolkata")}</li>
  <li>${dateInZone("Europe/Paris")}</li>
  <li>${dateInZone("America/New_York")}</li>
  </ul>`)
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
