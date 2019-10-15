# SauceNAO search bot for telegram

Add friend: [@SauceNAO_Search_bot](https://t.me/SauceNAO_Search_bot)

![preview](https://i.imgur.com/QTeACMz.png)

## Deploy

Create a `.env` file like this, and fill in the required information:

```env
SAUCENAO_APIKEY=
TG_TOKEN=
HOST=127.0.0.1
WEBHOOK_URL=
DEBUG=saucenao-tg:*
DATABASE_URL=
MINIUM_SIMILARITY=50
MAX_RESULT_COUNT=3
```

* `WEBHOOK_URL` is 'http://' or 'http://' + your hostname, such as `https://saucenao-tg-bot.mydomain.net`. (Do not add a slash at the end)
* `DATABASE_URL` is a connection string to a PostgreSQL database.


And `yarn start` to start the bot.
