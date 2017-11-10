module.exports = function (context, req) {
    context.log('================== New Req ======================');
    context.log(context);
    context.log(req);
    // if req has a body process body
    if (req.body) {
        // if a challenge request respond with challenge
        if (req.body.challenge) {
            context.res = {
                // status: 200, /* Defaults to 200 */
                headers: {
                    'Content-Type': 'application/json'
                },
                body: { challenge: req.body.challenge }

            };
        }
        // Not a challenge so lets process the message
        else {
            context.log(req.body);

        }
    }
    context.done();
};


