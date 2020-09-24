const crypto = require("crypto")
const moment = require('moment')

//console.log(sn)
//console.log(Date.now())

const URL = process.env.URL
const MerchantID = process.env.MERCHANT_ID
const HashKey = process.env.HASH_KEY
const HashIV = process.env.HASH_IV
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"
const ReturnURL = URL + "/newebpay/callback?from=ReturnURL"
const NotifyURL = URL + "/newebpay/callback?from=NotifyURL"
const ClientBackURL = URL + "/orders"

module.exports = {
  getTradeInfo: (userId, Amt, Desc, email) => {
    let getDataChain = function (TradeInfo) {
      let results = []
      for (let kv of Object.entries(TradeInfo)) {
        results.push(`${kv[0]}=${kv[1]}`)
      }
      return results.join('&')
    }

    let create_mpg_aes_encrypt = function (TradeInfo) {
      let encrypt = crypto.createCipheriv('aes256', HashKey, HashIV)
      let enc = encrypt.update(getDataChain(TradeInfo), 'utf8', 'hex')
      return enc + encrypt.final('hex')
    }

    let create_mpg_sha_encrypt = function (TradeInfo) {
      let sha = crypto.createHash('sha256')
      let plaintext = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`
      return sha.update(plaintext).digest('hex').toUpperCase()
    }

    // console.log('===== getTradeInfo =====')
    // console.log(Amt, Desc, email)
    // console.log('==========')

    // FOR LOAD TESTING
    //const sn = userId 

    //FOR PRODUCTION 
    const date = new Date()
    const sn = moment(date).format('YYYYMMDDHHMMSS') + userId

    data = {
      'MerchantID': MerchantID, // 商店代號
      'RespondType': 'JSON', // 回傳格式
      'TimeStamp': Date.now(), // 時間戳記
      'Version': 1.5, // 串接程式版本
      'MerchantOrderNo': sn, // 商店訂單編號
      'LoginType': 0, // 藍新會員
      'OrderComment': 'OrderComment', // 商店備註
      'Amt': Amt, // 訂單金額
      'ItemDesc': Desc, // 產品名稱
      'Email': email, // 付款人電子信箱
      'ReturnURL': ReturnURL, // 支付完成返回商店網址
      'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
      'ClientBackURL': ClientBackURL // 支付取消返回商店網址
    }

    // console.log('===== getTradeInfo: data =====')
    // console.log(data)

    mpg_aes_encrypt = create_mpg_aes_encrypt(data)
    mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

    // console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
    // console.log(mpg_aes_encrypt)
    // console.log(mpg_sha_encrypt)

    tradeInfo = {
      'MerchantID': MerchantID, // 商店代號
      'TradeInfo': mpg_aes_encrypt, // 加密後參數
      'TradeSha': mpg_sha_encrypt,
      'Version': 1.5, // 串接程式版本
      'PayGateWay': PayGateWay,
      'MerchantOrderNo': data.MerchantOrderNo
    }

    // console.log('===== getTradeInfo: tradeInfo =====')
    // console.log(tradeInfo)

    return tradeInfo
  },

  create_mpg_aes_decrypt: (TradeInfo) => {
    let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
    decrypt.setAutoPadding(false);
    let text = decrypt.update(TradeInfo, "hex", "utf8");
    let plainText = text + decrypt.final("utf8");
    let result = plainText.replace(/[\x00-\x20]+/g, "");
    return result;
  }

}