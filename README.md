# E-Commerce 
簡易電商網站，使用者可以登入網站，將商品加入購物車，再將購物車的商品轉為訂單，並以信用卡付款完成交易。

[**DEMO HERE**](http://ecommercedemo-env.eba-tha6ig6k.ap-northeast-1.elasticbeanstalk.com/)

![](https://i.imgur.com/gvDVby7.png)

## 使用者故事及規格

### 已完成
- [x] 使用者可以建立帳號並登入
- [x] 使用者可以瀏覽商品
- [x] 使用者可以將商品加入購物車
- [x] 登入的使用者可以將購物車中的商品轉為訂單
- [x] 登入的使用者可以看到自己全部的訂單
- [x] 登入的使用者可以看到訂單的付款及運送狀況
- [x] 登入的使用者可以選擇任一訂單付款
- [x] 登入的使用者可以使用信用卡一次付清

### 進行中
- [ ] 使用者可以使用 Facebook 帳號登入 (需要https)
- [ ] 使用者可以在 navbar 看到購物車中的商品
- [ ] 登入的使用者將購物車中的商品轉為訂單後，會收到訂單成立通知信

### 商品秒殺場景
- [ ] 大量用戶在相同時間購買相同商品 (使用JMeter模擬)
- [ ] 使用 Redis 作快取

## Test Account
| role |      account      | password |
|:----:|:-----------------:|:--------:|
| user | user0@example.com |   123    |
| user | user1@example.com |   123    |
| user | user2@example.com |   123    |

## Author
[Justin Huang 黃士庭](https://www.linkedin.com/in/justinhuang777/) 
