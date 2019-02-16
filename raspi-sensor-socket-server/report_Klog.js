/**
 * reprot to klogger 
 * @N
 * 20180506
 * 
 */

// OFF = false
// ON = ture
const report_switch = false;

var log = require('./log');

var logger = log.logger("ReportLogger");

var kloggerurl = {
    host: "loggerdb",
    port: 10080
};

var http = require("http");


var report_init = function (service, info) {

    var nowDate = new Date();
    var localTime = nowDate.toLocaleString(); //获取日期与时间

    var data = {
        time: localTime,
        service: service,
        info: info
    };

    logger.info("report sevices init");

    data = JSON.stringify(data);

    var opt = {
        method: "PUT",
        host: kloggerurl.host,
        port: kloggerurl.port,
        path: "/init/" + service,
        headers: {
            "Content-Type": 'application/json',
            "Content-Length": data.length
        }
    };

    var req = http.request(opt, function (response) {
        console.log("1: " + response.statusCode);
        var body = "";
        response.on('data', function (data) { body += data; })
            .on('end', function () { console.log("json传输完毕"); })
            .on('success', function () { console.log("success"); })
            .on('error', function () { console.error("report_klog something wrong"); });

    });
    req.on('error', (e) => { console.error(`something wrong when connect logger server: ${e.message}`); });
    req.write(data + "\n");
    req.end();
}

var reprot_loss = function (service, code, info) {

    var nowDate = new Date();
    var localTime = nowDate.toLocaleString(); //获取日期与时间

    var data = {
        time: localTime,
        service: service,
        code: code,
        info: info
    };

    logger.info("report sevices loss");

    data = JSON.stringify(data);

    var opt = {
        method: "PUT",
        host: kloggerurl.host,
        port: kloggerurl.port,
        path: "/loss/" + service,
        headers: {
            "Content-Type": 'application/json',
            "Content-Length": data.length
        }
    };

    var req = http.request(opt, function (response) {
        console.log("2: " + response.statusCode);
        var body = "";
        response.on('data', function (data) { body += data; })
            .on('end', function () { console.log("json传输完毕"); })
            .on('success', function () { console.log("success"); });

    });
    req.on('error', (e) => { console.error(`something wrong when connect logger server: ${e.message}`); });
    req.write(data + "\n");
    req.end();
}

if (false == report_switch) {
    exports.report_init = function(service, info){console.log("report_init: "+service+"-"+info);};
    exports.reprot_loss = function(service, code, info){console.log("reprot_loss: "+service+" - code: "+ code+" - "+info);};
}
else {
    exports.report_init = report_init;
    exports.reprot_loss = reprot_loss;
}


