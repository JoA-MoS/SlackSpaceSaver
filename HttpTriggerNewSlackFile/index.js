module.exports = function (context, req) {
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
    }
    context.done();
};


