var request = require('request');
var _ = require('underscore');
/*
 * GET home page.
 */

function buildQuery(query) {
    var data = JSON.parse(query);
    console.log(data);

    var list = _.map(data, function(d) {
        return "?s " + d.p + " " + d.o + ".";
    });

    var result = _.reduce(list, function(sum, e) {
        return sum + e;
    })

    console.log("SPARQL queries " + result)
    return result;
}

exports.input2 = function(req, respond){
    var query = req.query.q || '[{"p": "<http://purl.org/dc/terms/subject>", "o": "<http://dbpedia.org/resource/Category:Touchscreen_mobile_phones>"}, {"p": "<http://dbpedia.org/property/connectivity>", "o": "<http://dbpedia.org/resource/Multi-band>"}]';
    console.log("Query: " + query);

    request.get({
        url: "http://live.dbpedia.org/sparql",
        qs: {
            "default-graph-uri": "http://dbpedia.org",
            "query":
                "select ?s where {" + buildQuery(query) + "} limit 10",
            "should-sponge": "grab-all",
//            "format": "application/sparql-results+json",
            "format": "text/x-html+tr",
            "timeout": 0,
            "debug": "on"
        }
//        json: true
    }, function (err, res, body) {
        console.log(body);
        respond.send(body);
    })
};
