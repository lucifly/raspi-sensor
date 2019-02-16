#!/usr/bin/env python3  
# -*- coding: UTF-8 -*-

# 定时测量障碍物距离

import RPi.GPIO as GPIO
import time
import json
import socket

print("RasPi Start")

SensorID = 80 
# latitude = 17.8
# longtitude = 109.8

SLEEPTIME = 5

# 创建 socket 对象
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 

# 获取远程主机名
host = "10.109.252.73"

# 设置端口号
port = 9181

# 设置引脚号
Trig_Pin = 4
Echo_Pin = 17


# 连接服务，指定主机和端口
s.connect((host, port))
print("connet wiht host %s : %d" %(host,port))

GPIO.setmode(GPIO.BCM)
GPIO.setup(Trig_Pin, GPIO.OUT, initial = GPIO.LOW)
GPIO.setup(Echo_Pin, GPIO.IN)

time.sleep(2)

def checkdist():
    GPIO.output(Trig_Pin, GPIO.HIGH)
    time.sleep(0.00015)
    GPIO.output(Trig_Pin, GPIO.LOW)
    while not GPIO.input(Echo_Pin):
        pass
    t1 = time.time()
    while GPIO.input(Echo_Pin):
        pass
    t2 = time.time()
    return (t2-t1)*340*100/2

count = 0
try:
    while True:
        t_distance = checkdist()
        print('Distance:%0.2f cm' % (t_distance))
        # Python 字典类型转换为 JSON 对象
        data = {
            'No' : count,
            'name' : 'RasPi',
            'type' : type,
            'DeviceID' : SensorID,
            'distance' : (t_distance),
            'timeStamp' : time.time()
        }
        sendmsg = json.dumps(data)
        s.send(sendmsg.encode('utf-8'))
        count += 1
        time.sleep(SLEEPTIME)
except KeyboardInterrupt:
    s.close()
    GPIO.cleanup()
