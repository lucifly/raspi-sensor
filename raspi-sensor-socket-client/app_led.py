#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

# 树莓派管脚操作示例

import RPi.GPIO as GPIO  
import time  
#import picamera  

#gpio = 17
red = 23 
blue = 24
green = 25
#初始化  
def init():  
    #设置不显示警告  
    GPIO.setwarnings(False)  
    #设置读取面板针脚模式  
    GPIO.setmode(GPIO.BCM)  
    #设置读取针脚标号  
    GPIO.setup(red,GPIO.OUT) 
    GPIO.setup(blue,GPIO.OUT) 
    GPIO.setup(green,GPIO.OUT)  
    pass  
   
def detct():  
    while True:  
        #当高电平信号输入时报警  
        GPIO.output(red,GPIO.HIGH)
        time.sleep(3)  
        GPIO.output(blue,GPIO.HIGH)
        time.sleep(3)
        GPIO.output(red,GPIO.LOW)
        GPIO.output(blue,GPIO.LOW)
        GPIO.output(green,GPIO.HIGH)
        time.sleep(3)  
        GPIO.output(green,GPIO.LOW)
  
def alart(curtime):  
    print(curtime + " Someone is coming!")  
try:  
    init()
    print("start")
    detct() 

except KeyboardInterrupt:
    GPIO.output(green,GPIO.LOW)
    GPIO.output(red,GPIO.LOW)
    GPIO.output(blue,GPIO.LOW)
    GPIO.cleanup()  
