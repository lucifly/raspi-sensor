#!/usr/bin/python3
# -*- coding: UTF-8 -*-

# raspi socket通信示例

# 导入 socket、sys 模块
import socket
import sys

# 创建 socket 对象
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 

# 获取本地主机名
#host = socket.gethostname() 
host = "10.109.252.59"

# 设置端口好
#port = 9999
port = 9081

# 连接服务，指定主机和端口
s.connect((host, port))

sendmsg = '{"data":"hello raspi"}'
s.send(sendmsg.encode('utf-8'))

# 接收小于 1024 字节的数据
msg = s.recv(1024)

s.close()

print (msg.decode('utf-8'))
