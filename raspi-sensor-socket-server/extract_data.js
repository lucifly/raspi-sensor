/**
 * Extract data
 * @N
 * 20180531
 * 
 */

var log = require('./log');

var logger = log.logger("Extract_data");

/**
 * 
 * @param {*} data 
 */
var extract = function (data) {
    logger.info("Extract_data");
    var returndata = {}; //return data

    ////////抽取数据//////////////////////////////////////////////////////////////////////	
    //latitude //纬度
    //longitude//经度
    // data = {
    //     'No' : count,
    //     'name' : 'RasPi',
    //     'info' : "sensor shaked ",
    //     'UID' : UID,
    //     'latitude' : latitude,
    //     'longtitude' : longtitude,
    //     'timeStamp' : ticks
    // }
    returndata.latitude = data.latitude;//纬度
    returndata.longtitude = data.longtitude;//经度
    returndata.timeStamp = data.timeStamp;//时间戳
    returndata.type = data.type;    // type = 1 shake  # type = 2 hum  # type = 3 shake and hum
    returndata.DeviceID = data.DeviceID;
    // returndata.type = data_json.type;//类型
    // returndata.direction = data_json.direction; //角度
    logger.info(JSON.stringify(returndata));
    //////////////////////////////////////////////////////////////////////////////////

    return returndata;
}

exports.extract = extract;
