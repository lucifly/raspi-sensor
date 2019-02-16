#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

# 生物红外感知传感器使用示例

import RPi.GPIO as GPIO  
import time  
#import picamera  

gpio = 17
#初始化  
def init():  
    #设置不显示警告  
    GPIO.setwarnings(False)  
    #设置读取面板针脚模式  
    GPIO.setmode(GPIO.BCM)  
    #设置读取针脚标号  
    GPIO.setup(gpio,GPIO.IN)  
    pass  
   
def detct():  
    while True:  
        #当高电平信号输入时报警  
        if GPIO.input(gpio) == True:
            curtime = time.strftime('%Y-%m-%d-%H-%M-%S',time.localtime(time.time()))
            alart(curtime)  
        time.sleep(3)  
  
def alart(curtime):  
    print(curtime + " Someone is coming!")  
  
init()
print("start")
detct()  
GPIO.cleanup()  
