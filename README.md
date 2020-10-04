# E-Commerce 
具備基本購物功能的電商網站，主要特色是實作商品秒殺場景所需之後端架構。

[**DEMO HERE**](https://justinhuang.app/)
[**Medium HERE**](https://medium.com/@mercedes722s/%E9%9B%BB%E5%95%86%E5%B0%88%E6%A1%88-%E5%95%86%E5%93%81%E7%A7%92%E6%AE%BA%E5%A0%B4%E6%99%AF%E5%AF%A6%E4%BD%9C-3f43c996b80a)

![](https://i.imgur.com/gvDVby7.png)

## 使用者故事及規格

### 已完成
2020/9/16
- [x] 使用者可以建立帳號並登入
- [x] 使用者可以瀏覽商品
- [x] 使用者可以將商品加入購物車
- [x] 登入的使用者可以將購物車中的商品轉為訂單
- [x] 登入的使用者可以看到自己全部的訂單
- [x] 登入的使用者可以看到訂單的付款及運送狀況
- [x] 登入的使用者可以選擇任一訂單付款
- [x] 登入的使用者可以使用信用卡一次付清

2020/10/3
- [x] 登入的使用者可以在導覽列購物袋看見已放入購物袋的商品
- [x] 使用者可以使用 Facebook 建立帳號並登入
- [x] 登入的使用者付款完成後，會收到訂單付款完成通知信
- [x] 新增 SSL 加密憑證

### 商品秒殺場景 (Load Testing)
- [x] JMeter 模擬大量使用者在相同時間購買相同商品
- [x] NGINX 作為負載平衡架構
- [x] redis 作為商品資料快取
- [x] MySQL transaction, conection pool 優化資料庫正確性與效能
- [x] influxdb + Grafana 實作測試儀表板，使資料視覺化

### 架構圖
![](https://i.imgur.com/TM9LBeZ.jpg)


### 負載測試儀表板
![](https://i.imgur.com/k9UdftM.jpg)


### 未來精進項目
- [ ] Message Queue - RabbitMQ / Kafka
- [ ] 增加 redis 存放的資料類型
- [ ] express 讀寫分離
- [ ] 增加 server 數量 & NGINX 實作負載平衡
- [ ] JMeter Distributed Testing


## 測試帳號
| role |      account      | password |
|:----:|:-----------------:|:--------:|
| user | user0@example.com |   123    |
| user | user1@example.com |   123    |
| user | user2@example.com |   123    |


## 環境
### Web App
* AWS EC2: t3.large
* Ubuntu: 18.04.5 LTS
* nginx: 1.14.0
* node.js: 12.18.4
* redis: 6.0.7

### Database
* AWS RDS
* MySQL: 8


### 測試
* JMeter: 5.3
* influxdb: 1.8.3
* Grafana: 7.2

## 套件
* async-redis: 1.1.7
* bcryptjs: 2.4.3
* body-parser: 1.19.0
* connect-flash: 0.1.1
* crypto: 1.0.1
* dotenv: 8.2.0
* express": 4.17.1
* express-handlebars: 5.1.0
* express-session: 1.17.1
* faker: 5.1.0
* method-override: 3.0.0
* moment: 2.29.0
* mysql2: 2.1.0
* nodemailer: 6.4.11
* passport: 0.4.1
* passport-facebook: 3.0.0
* passport-local: 1.0.0
* pm2: 4.4.1
* redis: 3.0.2
* sequelize: 5.8.6
* sequelize-cli: 5.4.0

## 開發者
[Justin Huang 黃士庭](https://www.linkedin.com/in/justinhuang777/) 