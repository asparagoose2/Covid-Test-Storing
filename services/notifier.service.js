require('dotenv').config(); 
const axios = require('axios');

const URL = process.env.SLACK_WEBHOOK_URL;
const CHANEL_ID = '#group-2213';
const BOT_NAME = 'CovidApp Bot';
const BOT_ICON = ':no_entry:';
const title = "Recieved an invalid test result file";

const sendNotification = function(fileName, errorMessage) {
    axios.post(URL, {
      channel: CHANEL_ID,
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: title },
          fields: [
            { type: 'mrkdwn', text: `*File Name*\n${fileName}` },
            { type: 'mrkdwn', text: `*Error*\n${errorMessage}` },
          ]
        }
      ],
      username: BOT_NAME, 
      icon_emoji: BOT_ICON

    }).then(res => {
        if(res.status === 200) {
            console.log('Notification sent');
        } else {
            console.log(`Notification not sent!
            Status: ${res.status}
            Error: ${res.data}`);
        }
    }).catch(err => console.log(err));
}

module.exports = sendNotification;