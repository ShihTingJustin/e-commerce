# E-Commerce 
具備基本購物功能的電商網站，主要特色是實作商品秒殺場景所需之後端架構。

#### 👉 [DEMO](https://justinhuang.app/)

#### 👉 [Medium 專案介紹](https://medium.com/@mercedes722s/電商專案-商品秒殺場景實作-3f43c996b80a)

###  測試帳號
| role |      account      | password |
|:----:|:-----------------:|:--------:|
| user | user0@example.com |   123    |
| user | user1@example.com |   123    |
| user | user2@example.com |   123    |

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
- [x] 使用者可以使用 Facebook 建立帳號並登入
- [x] 登入的使用者付款完成後，會收到訂單付款完成通知信
- [x] 新增 SSL 加密憑證

### 商品秒殺場景 (Load Testing)
- [x] JMeter 模擬大量使用者在相同時間購買相同商品
- [x] NGINX 調校讓伺服器承受更高的請求數量
- [x] redis 作為商品資料快取
- [x] MySQL 優化資料庫正確性與效能


### 架構圖
![](https://i.imgur.com/hOpijmt.jpg)

### ERD
![](https://i.imgur.com/NZBdRKd.png)


### 未來精進項目
- [ ] 訊息佇列 RabbitMQ / Kafka
- [ ] 增加 server 數量 & NGINX 負載平衡
- [ ] Linux 在高併發下有可能受限於 kernel, TCP 參數
- [ ] 將更多資料庫操作放到 redis
- [ ] express 讀寫分離
- [ ] 嘗試使用 NoSQL

## 環境
### Web App (AWS EC2: t2.micro)
* Ubuntu: 18.04.5 LTS
* nginx: 1.14.0
* node.js: 12.18.4

### Database (AWS RDS: t2.micro)
* MySQL: 8
* redis: 6.0.7

### 測試
* JMeter: 5.3

### 儀表板
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
