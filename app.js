var request = require('request');
var fs = require('fs');
var host = "https://api.telegram.org";
var botId = "CHANGE-THIS";
var timeRequest = 3; //seconds
var lastMsgFile = "last.msg";
var lastMsg = "";
var rssFiles = "rss.txt";
var interval;
var xml = require('xml2js').parseString;
fs.exists(lastMsgFile, function(exists) {
	if (!exists) {
		fs.writeFileSync(lastMsgFile,"0");
		lastMsg = 0;
	} else {
		lastMsg = fs.readFileSync(lastMsgFile,'utf8');
	}
	rss = fs.readFileSync(rssFiles,'utf8');
	interval = setInterval(requestHost,timeRequest*1000);
});

function sendMessage(link,chat) {
	request(link, function(error, response, body) {
		if (!error) {
			xml(body,function(err,result) {
				if (!err) {
					var msg = "";
					var item = result.rss.channel[0].item;
					for (i=0;i<item.length;i++) {
						msg += item[i].title+"\n"+item[i].description+"\n"+item[i].link+"\n\n";
					}
				}
				if (parseInt(msg.length/4096) >1) {
					for(var l=0;l<msg.length/4096;l++) {
						var msgOk = msg.substring(l*4096,(l+1)*4096);
						console.log(msgOk);
						sendTelegram(msgOk,chat);
					}
				} else {
					sendTelegram(msg,chat);
				}
			});	
		}
	});
}

function sendTelegram(msg,chat) {
	request(host+"/bot"+botId+"/sendMessage?chat_id="+chat+"&text="+encodeURIComponent(msg),function(err,res,body) {
		if (!err) {
			console.log('Message Sent');
		} else {
			console.error('Error sending message');
			console.error(err);
		}
		
	});
}


function requestHost() {
	clearInterval(interval);
	request(host+"/bot"+botId+'/getUpdates', function(error, response, body) {
		try {
			var json = JSON.parse(body);
		} catch(e) {
			console.log(body);
			console.error('Response is not a JSON type');
		}
		var msg = "Commands avaiable:\n";
		for (var i =0;i<json.result.length;i++) {
			//console.log(parseInt(lastMsg));
			if (parseInt(lastMsg) < json.result[i].message.message_id) {
				fs.writeFileSync(lastMsgFile,json.result[i].message.message_id);
				lastMsg = json.result[i].message.message_id;
				var chat = json.result[i].message.chat.id;
				var rssLine = rss.split("\n");
				for (var r=0;r<rssLine.length;r++) {
					if (rssLine[r].charAt(0) != '#') {
						var link = rssLine[r].split('|')[1];
						var text = rssLine[r].split('|')[0].split(',');
						for (t=0;t<text.length;t++) {
							var string = json.result[i].message.text;
							if (json.result[i].message.text != "") {
								if (json.result[i].message.text.toLowerCase() == 'help') {
									msg += text[t]+"\n";
								} else {
									if (string.toLowerCase().indexOf(text[t]) >= 0) {
										sendMessage(link,chat);
									}
								} 
							} 
						}
					}

				}
				if (json.result[i].message.text == 'help') {
					sendTelegram(msg,chat);
				}
			}
		}

		interval = setInterval(requestHost,timeRequest*1000);
	});
}