# SauceNAO search bot for telegram

Add friend: [@SauceNAO_Search_bot](https://t.me/SauceNAO_Search_bot)

![preview](https://i.imgur.com/QTeACMz.png)

## Deploy on Heroku
- Fork this repo
- Make a clone on local
- Create a .env file with following details.
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
![folder](https://imgur.com/8cyw56g.png)
- Remove .env from .gitignore
![subl](https://imgur.com/xuAc9F1.png)

### Getting WEBHOOK_URL & DATABASE_URL

- Goto [Heroku.com](https://signup.heroku.com/)
![site](https://imgur.com/4PT9yLd.png)
- Create a new app with your desired name
![app](https://imgur.com/HIrtMHc.png)
![appdone](https://imgur.com/XX0H220.png)
- Goto Resources and add Heroku Postgres
![resource](https://imgur.com/ku7F6hn.png)
- Goto Settings
![settings](https://imgur.com/JuQvMhQ.png)
- Add in Config Vars *YARN_PRODUCTION = false*
- Use DATABASE_URL to add 
```
WEBHOOK_URL= your-app-name.herokuapp.com
DATABASE_URL= postgres://
```

### Make telegram bot & Get TG_TOKEN

- Telegram bot can be made using [BotFather](https://core.telegram.org/bots#6-botfather).
- Use this to add 
```
TG_TOKEN=110201543:AAHdqTcvCH1vGs0K5PALDsaw....
```
_Note: You can add SAUCENAO_APIKEY from [saucenao.com](https://saucenao.com/user.php?page=search-api) by creating a free account, but it is not necessary._

![final env](https://imgur.com/m7S3AE4.png)

### Deploying to Heroku

_Note: heroku_cli, [postgres](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup) and git should be installed and setup at this point._
- Open git bash
```
heroku git:remote -a saucenao-bot-test
```
![site](https://imgur.com/7m87H3M.png)
![deploy](https://imgur.com/jj1cyDl.png)
![Installing postgres](https://imgur.com/WShPuG3.png)
![add tebles to db](https://imgur.com/SN9Ni4L.png)

_`WEBHOOK_URL` is 'http://' or 'http://' + your hostname, such as `https://saucenao-tg-bot.mydomain.net`. (***Do not add a slash at the end***)_

### Talk to the Bot
![telegram](https://imgur.com/8qf8mGm.png)

## Local Deploy
- Fork this repo
- Make a clone on local
- Create a .env file with following details.
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
![folder](https://imgur.com/8cyw56g.png)

### Make telegram bot & Get TG_TOKEN

- Telegram bot can be made using [BotFather](https://core.telegram.org/bots#6-botfather).
- Use this to add 
```
TG_TOKEN=110201543:AAHdqTcvCH1vGs0K5PALDsaw....
```
_Note: You can add SAUCENAO_APIKEY from [saucenao.com](https://saucenao.com/user.php?page=search-api) by creating a free account, but it is not necessary._

### Get WEBHOOK_URL
- It is some URL that is publicly accessible through the Internet. For example, http://your.domain.com or http://123.45.67.89

### Get DATABASE_URL
- Create a local or online database and provide its link like:
```postgresql://DB_USER:DB_USER_PASS@DB_URL:DB_PORT/DB_NAME```

### Offline deploy
_Note: yarn should be installed at this point._
- Replace [this line](https://github.com/maple3142/saucenao-search-tgbot/blob/master/src/index.ts#L20) with `polling: true`
- Also remove [these lines](https://github.com/maple3142/saucenao-search-tgbot/blob/master/src/index.ts#L23-L26) too from the local files.
-`yarn start` to start the bot.
