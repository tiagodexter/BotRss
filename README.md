# BotRss
Bot generated with NodeJS for Telegram.
This Bot use Telegram API to comunicate with users.
It be used with multiple groups.
It read XML RSS Feeds.

To use, just run this commands: (Please remember, you need node and npm installed before)
```
# git clone https://github.com/tiagodexter/BotRss.git
# cd BotRss
# npm install
```

To configure it, just change in `app.js` this line:
```
var botId = "CHANGE-THIS";
```

The will read all updates received, and check if the line received contains some command saved in `rss.txt`
If the command found, it will access the RSS link and parse the XML data.
The `rss.txt` file need be in this format:
Commands(comma separeted)|Rss Link
Example:
```
all,ignall|http://feeds.ign.com/ign/all?format=xml
```
After configure bot, you just need run it, or demonize it.
To run, just use this:
```
# node app.js
```
For demonize this code, I'm using [PM2](http://pm2.keymetrics.io/) code.

After install you just need to run:
```
# pm2 start -n BotRss app.js
```

If the bot receive the help command, it will read `rss.txt` file and send to users all commands avaiable