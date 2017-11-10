var request = require("request");

module.exports = function (context, req) {
    context.log('================== New Req ======================');
    // context.log(context);
    // context.log(req);
    // if req has a body process body
    if (req.body) {
        // if a challenge request respond with challenge
        if (req.body.type) {
            switch (req.body.type) {
                case 'url_verification':
                    context.log('url_verification');
                    context.res = {
                        // status: 200, /* Defaults to 200 */
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: { challenge: req.body.challenge }
                    };
                    break;
                case 'event_callback':
                    switch (req.body.event.type) {
                        case 'file_created':
                            context.log('file_created');
                            options = {
                                method: 'GET',
                                uri: `https://slack.com/api/files.info?token=${process.env['Slack_Token']}&file=${req.body.event.file_id}`,
                                //headers: headers
                            };
                            context.log(options.uri);
                            request(options, function (error, res, body) {
                                context.log(error);
                                context.log(body);
                                context.res = { body: body || '' };
                            });
                            break;
                        case 'file_change':
                            context.log('file_change');
                            context.res = {
                                // status: 200, /* Defaults to 200 */
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: { incoming_req: req.body }

                            };
                            break;
                        default:
                            context.log('event default');
                            context.log({ error: req.body.event.type + ' is not implemented' });
                            context.log(req);
                            context.res = {
                                // status: 200, /* Defaults to 200 */
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: {
                                    error: req.body.type + ' is not implemented',
                                    request: req
                                }
                            };
                            break;

                    }

                default:
                    context.log('default');
                    context.log({ error: req.body.type + ' is not implemented' });
                    context.log(req);
                    context.res = {
                        // status: 200, /* Defaults to 200 */
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: {
                            error: req.body.type + ' is not implemented',
                            request: req
                        }

                    };
                    break;
            }
        }
    }
    context.done();
};


function GetEnvironmentVariable(name) {
    return name + ": " + process.env[name];
}

