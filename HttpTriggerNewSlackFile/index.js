var request = require('request');

module.exports = function (context, req) {
    context.log('================== New Req ======================');
    // context.log(context);

    // if req has a body process body
    if (req.body) {
        context.log(req.body);
        if (req.body.type) {
            // if a challenge request respond with challenge
            switch (req.body.type) {
                case 'url_verification':
                    challengeValidation(context, req.body);
                    break;
                case 'event_callback':
                    handleSlackEvents(context, req.body.event);
                    break;
                default:
                    context.log('default');
                    context.log({ error: req.body.type + ' is not implemented' });
                    sendJsonResponse(context, {
                        error: req.body.type + ' is not implemented',
                        request: req
                    }, 400);
                    break;
            }
        }
    }


    function handleSlackEvents(context, event) {
        switch (event.type) {
            case 'file_created':
                context.log('file_created');
                getSlackFileInfo(context, event.file_id);
                break;
            case 'file_change':
                context.log('file_change');
                sendJsonResponse(context, { event: event }, 200);
                break;
            default:
                context.log('event default');
                context.log({ error: event.type + ' is not implemented' });
                sendJsonResponse(context, {
                    error: event.type + ' is not implemented',
                    event: event
                }, 400);
                break;
        }
    }


    function challengeValidation(context, body) {
        context.log('url_verification');
        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: {
                'Content-Type': 'application/json'
            },
            body: { challenge: body.challenge }
        };
    }

    function getSlackFileInfo(context, fileId) {
        options = {
            method: 'GET',
            uri: `https://slack.com/api/files.info?token=${process.env['Slack_Token']}&file=${fileId}`
            //headers: headers
        };
        context.log(options.uri);
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                sendJsonResponse(context, JSON.parse(body));
            }
            else {
                context.log(error);
            }
        });
    }


    function sendJsonResponse(context, body, status = 200) {
        context.res = {
            status: status, /* Defaults to 200 */
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        };
        context.done();
    }

};


