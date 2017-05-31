# GH Viewer authentication server

GitHub OAuth server for the demo GH Viewer app.

## Prerequisites

Go to https://github.com/settings/developers and register a new application.

## Installation using Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You'll need to set the `CLIENT_ID` and `CLIENT_SECRET` config variables according to your application values.

## Manual installation

Requires node v7+

```sh
yarn install
CLIENT_ID=[your client ID] CLIENT_SECRET=[your client secret] SCOPE='user:follow read:org' yarn start
```

## License

MIT  
See [LICENSE](LICENSE) file.
