const got = require('got')
const { send } = require('micro')
const redirect = require('micro-redirect')
const { stringify } = require('querystring')
const { parse } = require('url')

const { CLIENT_ID, CLIENT_SECRET, SCOPE } = process.env
const AUTH_PARAMS = stringify({
  client_id: CLIENT_ID,
  scope: SCOPE ? SCOPE : 'public_repo',
})
const AUTH_URL = `https://github.com/login/oauth/authorize?${AUTH_PARAMS}`
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
        redirect(res, 303, `/success?${stringify(auth.body)}`)
        return
      }
      // Redirected to client-known success URL -> end of flow
      case '/success':
        return 'OK'

      default:
        send(res, 404, 'Not found')
    }
  } catch (err) {
    console.log(req.url, err)
    send(res, 500, 'Internal error')
  }
}
