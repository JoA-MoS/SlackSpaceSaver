const request = require('request');



module.exports = function (context, req) {
    const SLACK_TOKEN = process.env['SLACK_TOKEN'];
    context.log('================== New Req ======================');
    context.log(SLACK_TOKEN);
    // context.log(context);

    // if req has a body process body
    if (req.body) {
        context.log(req.body);
        if (req.body.type) {
            // if a challenge request respond with challenge
            switch (req.body.type) {
                case 'url_verification':
                    challengeValidation(req.body);
                    break;
                case 'event_callback':
                    handleSlackEvents(req.body.event);
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


    function handleSlackEvents(event) {
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


    function challengeValidation(body) {
        context.log('url_verification');
        sendJsonResponse(context, { challenge: body.challenge });
    }

    function getSlackFileInfo(fileId, cb) {
        options = {
            method: 'GET',
            uri: `https://slack.com/api/files.info?token=${SLACK_TOKEN}&file=${fileId}`
            //headers: headers
        };
        context.log(options.uri);
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                sendJsonResponse(JSON.parse(body));
            }
            else {
                context.log(error);
            }
        });
    }


    function sendJsonResponse(body, status = 200) {
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


