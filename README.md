# SauceNAO search bot for telegram

Add friend: [@SauceNAO_Search_bot](https://t.me/SauceNAO_Search_bot)

![preview](https://i.imgur.com/QTeACMz.png)

## Deploy

### Heroku

> Make sure you have [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed beforehand.

1. Create a app on [Heroku](https://herokuapp.com/)
2. Add [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql) to your app
3. Clone this repo
4. Create a .env file with following details

```env
SAUCENAO_APIKEY=
TG_TOKEN=
WEBHOOK_URL=
DEBUG=saucenao-tg:*
DATABASE_URL=
MINIUM_SIMILARITY=50
MAX_RESULT_COUNT=3
```

5. Remove `.env` from `.gitignore` and commit
6. `heroku git -a YOUR_APP_NAME`
7. `git push heroku master`

#### WEBHOOK_URL

It should be `https://your-app-name.herokuapp.com`.

#### DATABASE_URL

In the dashboard of your Heroku app, click the **Heroku Postgres** addon and go to the setting page and find the value of **URI**. Simply fill it to `DATABASE_URL`.

### Local

1. Clone this repo
2. Create a .env file with following details

```env
SAUCENAO_APIKEY=
TG_TOKEN=
WEBHOOK_URL=
DEBUG=saucenao-tg:*
DATABASE_URL=
MINIUM_SIMILARITY=50
MAX_RESULT_COUNT=3
```

3. `yarn start` or `npm start`

#### WEBHOOK_URL

It is some URL that is publicly accessible through the Internet. For example, http://your.domain.com or http://123.45.67.89 (Your ip)

#### DATABASE_URL

You can install a PostgreSQL on your local computer or find some **PostgreSQL as a service** to use.

The format of `DATABASE_URL` should be: `postgresql://DB_USER:DB_USER_PASS@DB_URL:DB_PORT/DB_NAME`

#### Local deploy without a publicly accessible ip

Replace [this line](https://github.com/maple3142/saucenao-search-tgbot/blob/801cab2550003b169f7b444dddc27bb5cb29df63/src/index.ts#L20) with `polling: true`, and remove [these lines](https://github.com/maple3142/saucenao-search-tgbot/blob/801cab2550003b169f7b444dddc27bb5cb29df63/src/index.ts#L23-L26) too.

