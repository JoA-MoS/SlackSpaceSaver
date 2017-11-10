module.exports = function (context, req) {
    context.log('================== New Req ======================');
    context.log(context);
    context.log(req);
    // if req has a body process body
    if (req.body) {
        // if a challenge request respond with challenge
        if (req.body.type) {
            switch (req.body.type) {
                case 'url_verification':
                    context.res = {
                        // status: 200, /* Defaults to 200 */
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: { challenge: req.body.challenge }

                    };
                    break;
                case 'file_change':
                    context.res = {
                        // status: 200, /* Defaults to 200 */
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: { incoming_req: req.body }

                    };
                    break;

                default:
                    context.res = {
                        // status: 200, /* Defaults to 200 */
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: { error: context.req.type + 'is not implemented' }

                    };
                    break;
            }
        }
    }
    context.done();
};


