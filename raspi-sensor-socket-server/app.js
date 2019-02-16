/**
 * raspi-sensor-gateway-server
 * 2018.1.12
 * @N
 * 
 */
var config_data = require("./config.json");
var socket_event = config_data.SOCKET_EVENT;

//$ node app.js service_id [IN_port || 8081 ] [OUT_port || 8082 ] [CMD_port || 8083 ]
if (process.argv.length < 3) {
	console.log("$ node app.js service_id [IN_port || 8081 ] [OUT_port || 8082 ] [CMD_port || 8083 ]");
	return;
}

//转发给其他节点rest服务器的map
var forward_map = {};

var SERVICE_ID = process.argv[2],
	IN_port = process.argv[3] || config_data.IN_port,
	OUT_port = process.argv[4] || config_data.OUT_port,
	CMD_port = process.argv[5] || config_data.CMD_port,
	HOST_IP = "0.0.0.0";//process.argv[6] || config_data.HOST_IP;//on k8s change to 0.0.0.0

var log = require('./log');

var logger = log.logger(SERVICE_ID);

logger.info("start service : " + SERVICE_ID);

require('./report_Klog').report_init(SERVICE_ID, "start");

//start server to broadcast data
// Websocket Server
var socketServer = new (require('ws').Server)({ port: OUT_port });
socketServer.on(socket_event.CONNECTION, function (socket) {

	logger.info('New WebSocket Connection (' + socketServer.clients.size + ' total)');

	socket.on('close', function (code, message) {
		logger.info('Disconnected WebSocket (' + socketServer.clients.size + ' total)');
	});
	socket.on('message', function (message) {
		logger.info('message  (' + message + ' )');
	});
});

socketServer.broadcast = function (data) {
	(this.clients).forEach(function (element) {
		if (element.readyState == 1) {
			element.send(data);
		}
		else {
			logger.error('Error: Client (' + i + ') not connected.');
			require('./report_Klog').reprot_loss(SERVICE_ID, 0, 'Error: Client (' + i + ') not connected.');
		}
	});
};

//wait for listen device msg
// logger.info("socket server start, listening device, and broadcast on " + OUT_port);
var net = require('net');
var server = net.createServer();
server.listen(IN_port, HOST_IP);
server.on('connection', function (socket) {
	//socket.setNoDelay(true);
	logger.info('DATA_CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
	socket.on('data', function (data) {
		var data_json = JSON.parse(data.toString());
		console.log("data_json: "+ JSON.stringify(data_json));

		//extract_data
		var broad_data = require('./extract_data').extract(data_json);

		console.log("broad_data: "+  JSON.stringify(broad_data));
		//send data to other node/////////////////////////////////////////////////
		// forward_map = {targetid:{
		//                        target_interface : souce_interface
		//                	       }
		//               }
		for (var target_url in forward_map) {
			var forward_url_end = target_url;
			//console.log("foward_map"+JSON.stringify(forward_map));
			var forward_info = forward_map[target_url];
			var forward_data = {};
			for (var forward_target_interface in forward_info) {
				forward_data[forward_target_interface] = broad_data[(forward_info[forward_target_interface])];
			}
			forward_data.targetID = forward_url_end;
			forward_data.CommandCode = 4;

			// 发送http请求
			device_port = 8080;
			console.log("device_host: " + forward_url_end + " device_port: " + device_port);
			console.log("forward data : " + forward_data);
			var thttp = require('http');
			var qs = require('querystring');
			var post_data = forward_data;
			// {    //     a: 123,    //     time: new Date().getTime()};//这是需要提交的数据   
			var content = JSON.stringify(post_data);

			console.log("post to device: " + content);
			// t_data.targetID = "000109";
			// t_data.type = "AIS";
			var options = {
				//host: device_host,  
				//port: device_port,
				host: forward_url_end,
				port: device_port,
				path: '/data',
				method: 'POST',
				headers: {
					"Content-Type": 'application/json',
					"Content-Length": content.length
				}

			};

			var req = thttp.request(options, function (res) {
				console.log('request STATUS: ' + res.statusCode);
				res.setEncoding('utf8');
				res.on('data', function (chunk) { console.log('BODY: ' + chunk); });
			});
			req.on('error', function (e) {
				require('./report_Klog').reprot_loss(forward_url_end, 1, e.message);
				console.error('problem with request: ' + e.message);
			});
			// write data to request body  
			req.write(content + "\n");
			req.end();
		}
		//////////////////////////////////////////////////////////////////////////

		//  var DBdata = {};
		//	DBdata.UID = "AIS01"
		//	DBdata.Data = broad_data;
		//	SendtoDB(JSON.stringify(DBdata));//send data to DB
		socketServer.broadcast(JSON.stringify(broad_data));//broadcast data
	});
});

var tnet = require('net');
var server_connect_CMD = tnet.createServer();
server_connect_CMD.listen(CMD_port, HOST_IP);
server_connect_CMD.on('connection', function (CMD_socket) {
	//socket.setNoDelay(true);
	console.log('CMD_CONNECTED: ' + CMD_socket.remoteAddress + ':' + CMD_socket.remotePort);
	CMD_socket.on('data', function (data) {
		console.log("get data");
		//var data_json = JSON.parse(data.toString());
		logger.info("data: " + data);
		//console.log("console data : " + data);
		fillmap(JSON.parse(data));


	});
});

console.log("socket server start HOST_IP : " + HOST_IP + ", listening data on " + IN_port + ", listening CMD_data on " + CMD_port + " , and broadcast on " + OUT_port);
/*
function SendtoDB(DBdata) {
	const WebSocket = require('ws');
	//const ws = new WebSocket('ws://10.108.93.148:9999/dataSrc');
	const ws = new WebSocket('ws://dataserver:9999/dataSrc');
	console.log("connetting to DB");
	ws.on('open', function () {
		console.log("connect");
		ws.send(DBdata);
	});

	var pro_ws = new Promise(function (resolve, reject) {
		ws.on('message', function incoming(data) {
			resolve(data);
		});
		ws.on('close', function close() {
			reject('disconnected');
		});
	});
	pro_ws.then(function (data) { console.log(data); ws.close(); });
	pro_ws.catch(function (data) { console.log(data) });

}
*/

//this function is to get mapJson from CMD and regularization
function fillmap(mapJSON) {

	//console.log("fillmap mapjson : " + mapJSON);
	forward_map = {};
	var nodes_arr = new Array();
	nodes_arr = mapJSON.nodes;
	//console.log("fill mapjson nodes_arr: "+ mapJSON["name"]);
	for (var i = 0; i < nodes_arr.length; i++) {
		//SERVICE_ID
		if ((nodes_arr[i]).src == SERVICE_ID) {

			var node_linking = (nodes_arr[i]).linking;

			for (var j = 0; j < node_linking.length; j++) {

				var t_linking = node_linking[j];
				if ((forward_map[(t_linking.src)]) == null) (forward_map[(t_linking.src)]) = {};
				//var tarr = {};
				(forward_map[(t_linking.src)])[t_linking.target_interface] = t_linking.source_interface;

				//(forward_map[(t_linking.src)]) = tarr ;

			}
			console.log("forward map : " + JSON.stringify(forward_map));

			break;
		}
	}

}
