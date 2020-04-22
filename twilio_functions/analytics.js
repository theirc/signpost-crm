exports.handler = function(context, event, callback) {
    const ua = require('universal-analytics');
    let visitor = ua(context.GA_KEY, event.FlowSid, {strictCidFormat: false});
        
    var params = {
        ec: event.Category,
        ea: event.Action,
    }
    
    console.log(params);
    
    visitor.event(params, function (err) {
        if(err) {
            console.log(err);
            callback(err, 'Error posting to Google Analytics');
        }
        callback(null, 'Success');
    });
};