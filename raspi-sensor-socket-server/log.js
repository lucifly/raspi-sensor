/********************************************
 * 
 * log for every day
 * @N
 * 2016.11.23
 *  
 *****************************************/


// logger.trace(‘Entering cheese testing’);
// logger.debug(‘Got cheese.’);
// logger.info(‘Cheese is Gouda.’);
// logger.warn(‘Cheese is quite smelly.’);
// logger.error(‘Cheese is too ripe!’);
// logger.fatal(‘Cheese was breeding ground for listeria.’);

var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        }, //控制台输出
        {
            type: "dateFile",
            filename: './logs/log',
            pattern: "_yyyy-MM-dd.log",
            alwaysIncludePattern: true
          //  category: 'dateFileLog'
        }//日期文件格式
    ],
    replaceConsole: true,   //替换console.log
    // levels:{
    //     dateFileLog: 'DEBUG'
    // }
});

levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
};

exports.logger = function (name, level) {
    var logger = log4js.getLogger(name);
    logger.setLevel(levels[level] || log4js.levels.DEBUG);
    return logger;
};

// 配合 express 使用的方法
exports.use = function (app, level) {
    app.use(log4js.connectLogger(log4js.getLogger('logInfo'), {
        level: levels[level] || levels['debug'],
        format: ':method :url :status :response-timems'
    }));
};




// var dateFileLog = log4js.getLogger('dateFileLog');
// var logger = {};
// exports.logger = logger;

// logger.debug = function(msg){
//     if(msg == null)
//         msg = "";
//     dateFileLog.debug(msg);
//    logger.info(msg);
// };

// logger.info = function(msg){
//     if(msg == null)
//         msg = "";
//     dateFileLog.info(msg);
//    logger.info(msg);
// };

// logger.warn = function(msg){
//     if(msg == null)
//         msg = "";
//     dateFileLog.warn(msg);
//    logger.info(msg);
// };

// logger.error = function(msg, exp){
//     if(msg == null)
//         msg = "";
//     if(exp != null)
//         msg += "\r\n" + exp;
//     dateFileLog.error(msg);
//    logger.info(msg);
// };


// exports.use = function(app) {
//     //页面请求日志,用auto的话,默认级别是WARN
//     //app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url'}));
//     app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url status::status :response-timems'}));
// }

