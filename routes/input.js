var request = require('request');
/*
 * GET home page.
 */

exports.input = function(req, respond){
    var query = req.query.q || "IPhone_4S";
    console.log("Query: " + query);

    request.get({
        url: "http://live.dbpedia.org/sparql",
        qs: {
            "default-graph-uri": "http://dbpedia.org",
            "query": "DESCRIBE <http://dbpedia.org/resource/" + query + ">",
            "should-sponge": "grab-all",
//            "format": "application/sparql-results+json",
            "format": "text/x-html+tr",
//            "format": "text/plain",
            "timeout": 0,
            "debug": "on"
        }
//        json: true
    }, function (err, res, body) {
        console.log(body);
        respond.send(body);
    })
};
