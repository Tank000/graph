var http  = require('http');
var parse = require('url').parse;
var timeoutTime= 200000;  //timeout in millisecond


// var HOST   = 'cloud.taguage.com';
// var PORT   = '80';

http.request=(function(_request){
    return function(options,callback){
        var timeout=timeoutTime,
            timeoutEventId;
        var req=_request(options,function(res){
            res.on('end',function(){
                clearTimeout(timeoutEventId);
            });
            
            res.on('close',function(){
                clearTimeout(timeoutEventId);
            });
            
            res.on('abort',function(){
                console.log('abort...');
            });
            
            callback(res);
        });
        
        //超时
        req.on('timeout',function(){
           // req.res && req.res.abort();
            req.abort();
        });
        
        //如果存在超时
        timeout && (timeoutEventId=setTimeout(function(){
            req.emit('timeout',{message:'请求超时!'});
        },timeout));
        return req;
    };
    
})(http.request)

var get = function(url,callback){
    var urlinfo = parse(url);
    var options = {
      host   : urlinfo.host,
      path   : urlinfo.path,
      method :'GET',
      headers: {
          'Authorization': 'ldVTm3L5oSH5NyQeTLufIyoAFdQMdH38LGp0lIW/Q3Q',
      }
    };
    // 设置请求超时
    var buf = [];
    var size = 0;
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chuck) {
            var buftmp = new Buffer(chuck);
            buf.push(buftmp);
            size += buftmp.length;
        }).on('end', function(){
            var data = Buffer.concat(buf,size).toString();
            console.log(res.statusCode)
            return callback(null,data);
        })
    });
    req.on('error', function(err) {
        return callback(err  ,null);
    }).on('timeout', function(e) {
        return callback(e  ,null);
    });
    req.end();

}

exports.one = function(req, res){
	var name = req.query.name;
	var url  = "https://api.datamarket.azure.com/Bing/Search/v1/Image?format=json&Query="+name;
	get(url,function (error, body) {
	  if(error) console.log(error);
	    res.send(body);
	})
};

