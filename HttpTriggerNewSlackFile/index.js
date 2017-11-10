
'use strict';

const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const slackEvents = createSlackEventAdapter(process.env['Slack_Token']);

const createAzureFunctionHandler = require('azure-function-express').createAzureFunctionHandler;
const express = require('express');
const bodyParser = require('body-parser');

// Create express app as usual
const app = express();

app.use(bodyParser.json());
app.use('/slack/events', slackEvents.expressMiddleware());

slackEvents.on('message', (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

slackEvents.on('error', console.error);


// app.get('/api/*', (req, res) => res.json({ hello: 'world' }));
// //app.get("/api/:foo/:bar", (req, res) => res.json({ foo: req.params.foo, bar: req.params.bar }));

// Binds the express app to an Azure Function handler
module.exports = createAzureFunctionHandler(app);
