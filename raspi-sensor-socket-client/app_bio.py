#!/usr/bin/python3
# -*- coding: UTF-8 -*-

# 生物红外感知与震动传感器联合检测生物经过

import json
import socket
import time

import RPi.GPIO as GPIO

print("RasPi Start")

SensorID = 80 
latitude = 17.8
longtitude = 109.8

SLEEPTIME = 0.5

# 创建 socket 对象
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 

# 获取远程主机名
host = "10.109.252.59"

# 设置端口号
port = 9081

# 设置引脚号
shake_gpio_pin = 4 # 设置震动传感器pin
hum_gpio_pin = 22  # 设置红外生物感知传感器pin

# 连接服务，指定主机和端口
s.connect((host, port))

print("GPIO shake_gpio_pin : %d; hum_gpio_pin: %d" %(shake_gpio_pin, hum_gpio_pin))
print("connet wiht host %s : %d" %(host,port))

# sendmsg = '{"data":"hello raspi"}'
# s.send(sendmsg.encode('utf-8'))

print("socket connet")

# 接收小于 1024 字节的数据
#msg = s.recv(1024)
#print (msg.decode('utf-8'))

#设置不显示警告  
GPIO.setwarnings(False)  
GPIO.setmode(GPIO.BCM)  
GPIO.setup(shake_gpio_pin,GPIO.IN)  
GPIO.setup(hum_gpio_pin,GPIO.IN) 
count = 0


if_shake = (GPIO.input(shake_gpio_pin))
if_hum = (GPIO.input(hum_gpio_pin))
try:
    while True :
        if if_shake == True or if_hum == True:
            ticks = time.time()
            localtime = time.asctime( time.localtime(time.time()) )
            # type = 1 shake
            # type = 2 hum
            # type = 3 shake and hum
            type = 0
            if if_shake == True :
                type += 1
                print("Sensor SHAKE at: ",localtime)
            if if_hum == True :
                type += 2
                print("Someone HERE at: ",localtime)

            # Python 字典类型转换为 JSON 对象
            data = {
                'No' : count,
                'name' : 'RasPi',
                'type' : type,
                'DeviceID' : SensorID,
                'latitude' : latitude,
                'longtitude' : longtitude,
                'timeStamp' : ticks
            }

            sendmsg = json.dumps(data)
            s.send(sendmsg.encode('utf-8'))
            count += 1
            type = 0
            time.sleep(SLEEPTIME)
        if_shake = (GPIO.input(shake_gpio_pin))
        if_hum = (GPIO.input(hum_gpio_pin))
        time.sleep(SLEEPTIME)
        
except KeyboardInterrupt:
    s.close()
    GPIO.cleanup()
