const got = require('got')
const { send } = require('micro')
const redirect = require('micro-redirect')
const { parse } = require('url')

const { CLIENT_ID, CLIENT_SECRET } = process.env
const AUTH_URL = `http://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
const TOKEN_URL = 'https://github.com/login/oauth/access_token'

module.exports = async (req, res) => {
  try {
    const { pathname, query } = parse(req.url, true)

    switch (pathname) {
      // Authorize request from client -> redirect to GitHub authorize URL
      case '/authorize':
        redirect(res, 303, AUTH_URL)
        return
      // Callback from GitHub -> retrieve the credentials using the code
      case '/callback': {
        const auth = await got(TOKEN_URL, {
          body: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: query.code,
          },
          json: true,
        })
        redirect(res, 303, `/success?${qs.stringify(auth)}`)
        return
      }
      // Redirected to client-known success URL -> end of flow
      case '/success':
        return

      default:
        send(res, 404, 'Not found')
    }
  } catch (err) {
    send(res, 500, 'Internal error')
  }
}
