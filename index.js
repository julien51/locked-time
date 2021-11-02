const express = require('express')
const cookieParser = require('cookie-parser')
const zones = require('./zones')
const configureUnlock = require('@unlock-protocol/unlock-express')
const app = express()
const port = process.env.PORT || 3000;

app.use(cookieParser())


const { membersOnly } = configureUnlock(
  {
    yieldPaywallConfig: () => {
      return {
        locks: {
          '0xafa8fE6D93174D17D98E7A539A90a2EFBC0c0Fc1': {
            network: 4,
          },
        },
      }
    },
    getUserEthereumAddress: async (request) => {
      return request.cookies.userAddress
    },
    updateUserEthereumAddress: async (
      request,
      response,
      address,
    ) => {
      response.cookie('userAddress', address)
    },
  },
  app
)

const dateInZone = (zone, label) => {
  const d = new Date();
  const city = label || (zone.split("/")[1]).replace('_', ' ')
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
  </ul>
  <p>Premium version: <a href="/premium">select any time zone</a>!</p>`)
})

app.get('/premium', membersOnly(), (req, res) => {
  res.send(`<h1>World Clocks</h1>
  <p>Thank you for your support!</p>
  ${zones.map((group) => {
    return `<div>
      <h2>${group.group}</h2>
      <ul>
        ${group.zones.map(({value, name}) => {
          return `<li>${dateInZone(value, name)}</li>`
        }).join("")}
      </ul>
    </div>`
  }).join("")}
  <p>Premium version: select any time zone!</p>
  <p><a href="/logout">Logout</a></p>`)
})

app.get('/logout', (req, res) => {
  res.clearCookie('userAddress')
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
