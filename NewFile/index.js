module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
    if (req.body && req.body.challenge) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: req.body.challenge
        };
    }
    else {
        context.res = {
            status: 400,
            body: "No Challenge Sent, Some other Change"
        };
    }



    context.done();
};

//{"challenge":"3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P"}
