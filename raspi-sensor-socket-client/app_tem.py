#!/usr/bin/python3
# -*- coding: UTF-8 -*-

# 温湿度传感器读取温湿度

import json
import socket
import time
import Adafruit_DHT
# import RPi.GPIO as GPIO

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
# shake_gpio_pin = 4 # 设置震动传感器pin
# hum_gpio_pin = 22  # 设置红外生物感知传感器pin
# Set GPIO sensor is connected to
gpio=17
# Set sensor type : Options are DHT11,DHT22 or AM2302
sensor=Adafruit_DHT.DHT11



# 连接服务，指定主机和端口
s.connect((host, port))

# print("GPIO shake_gpio_pin : %d; hum_gpio_pin: %d" %(shake_gpio_pin, hum_gpio_pin))
print("connet wiht host %s : %d" %(host,port))

# sendmsg = '{"data":"hello raspi"}'
# s.send(sendmsg.encode('utf-8'))

print("socket connet")

# 接收小于 1024 字节的数据
#msg = s.recv(1024)
#print (msg.decode('utf-8'))

# #设置不显示警告  
# GPIO.setwarnings(False)  
# GPIO.setmode(GPIO.BCM)  
# GPIO.setup(shake_gpio_pin,GPIO.IN)  
# GPIO.setup(hum_gpio_pin,GPIO.IN) 
count = 0


# if_shake = (GPIO.input(shake_gpio_pin))
# if_hum = (GPIO.input(hum_gpio_pin))
try:
    while True :
        # Use read_retry method. This will retry up to 15 times to
        # get a sensor reading (waiting 2 seconds between each retry).
        humidity, temperature = Adafruit_DHT.read_retry(sensor, gpio)
        localtime = time.asctime( time.localtime(time.time()) )
        print("sensor shake at: ",localtime)
        # Reading the DHT11 is very sensitive to timings and occasionally
        # the Pi might fail to get a valid reading. So check if readings are valid.
        if humidity is not None and temperature is not None:
            print('Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity))
                        # Python 字典类型转换为 JSON 对象
            data = {
                'No' : count,
                'name' : 'RasPi',
                # 'type' : type,
                'DeviceID' : SensorID,
                'temperature' : temperature,
                'humidity' : humidity,
                'timeStamp' : int(round(time.time() * 1000))
            }

            sendmsg = json.dumps(data)
            s.send(sendmsg.encode('utf-8'))
            count += 1
        else:
            print('Failed to get reading. Try again!')
        # time.sleep(5)
        # if if_shake == True or if_hum == True:
        #     ticks = time.time()
        #     localtime = time.asctime( time.localtime(time.time()) )
        #     # type = 1 shake
        #     # type = 2 hum
        #     # type = 3 shake and hum
        #     type = 0
        #     if if_shake == True :
        #         type += 1
        #         print("Sensor SHAKE at: ",localtime)
        #     if if_hum == True :
        #         type += 2
        #         print("Someone HERE at: ",localtime)


            # type = 0
            # time.sleep(SLEEPTIME)
        # if_shake = (GPIO.input(shake_gpio_pin))
        # if_hum = (GPIO.input(hum_gpio_pin))
        time.sleep(SLEEPTIME)
        
except KeyboardInterrupt:
    s.close()
