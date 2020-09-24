require('dotenv').config()
const db = require('../models')
const { CartItem, Order, OrderItem, Product } = db
const sequelize = require('sequelize')
const payService = require('../services/newebpay')
const mailService = require('../services/mail')
const { Sequelize } = require('sequelize')

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({
      where: { UserId: req.user.id },
      include: [{
        model: Product, as: "items"
      }]
    }).then(orders => {
      orders = orders.map(order => ({
        ...order.dataValues
      }))
      return res.render('orders', { orders })
    })
  },

  postOrder: (req, res) => {
    // create order
    CartItem.findAll({
      raw: true,
      nest: true,
      where: { UserId: req.user.id },
      include: [Product]
    }).then(cartItems => {
      const { name, address, phone, shipping_status, payment_status, amount } = req.body
      return Order.create({
        name,
        address,
        phone,
        shipping_status,
        payment_status,
        amount: amount.replace(/,/g, ''),
        UserId: req.user.id
      }).then(order => {    // put product in order from cart
        let results = []
        for (let i = 0; i < cartItems.length; i++) {
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cartItems[i].ProductId,
              price: cartItems[i].Product.price,
              quantity: cartItems[i].quantity
            })
          )
        }
        // clear cart after order finish
        Promise.all(results).then(() => {
          return CartItem.destroy({
            where: { UserId: req.user.id }
          })
        }).then(() => { return res.redirect('/orders') })
      })
    })
  },

  cancelOrder: (req, res) => {
    Order.findByPk(req.params.id)
      .then(order => {
        order.update({
          ...req.body,
          shipping_status: '-1',
          payment_status: '-1'
        })
      }).then(() => {
        return res.redirect('back')
      })
  },

  getPayment: (req, res) => {
    // console.log('===== getPayment =====')
    // console.log(req.params.id)
    // console.log('==========')
    return Order.findByPk(req.params.id)
      .then(order => {
        const tradeInfo = payService.getTradeInfo(req.user.id, order.amount, '商品名稱', process.env.GMAIL_ACCOUNT)
        order.update({
          ...req.body,
          sn: tradeInfo.MerchantOrderNo
        }).then(order => {
          order = order.toJSON()
          return res.render('payment', { order, tradeInfo })
        })
      })
  },

  newebpayCallback: (req, res) => {
    console.log('===== newebpayCallback =====')
    console.log(req.method)
    console.log(req.query)
    console.log(req.body)
    console.log('==========')

    console.log('===== newebpayCallback: TradeInfo =====')
    console.log(req.body.TradeInfo)


    const data = JSON.parse(payService.create_mpg_aes_decrypt(req.body.TradeInfo))

    console.log('===== newebpayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)

    return Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } }).then(orders => {
      orders[0].update({
        ...req.body,
        payment_status: 1,
      }).then(() => {
        return res.redirect('/orders')
      }).then(() => {
        // send payment confirmation email
        let mailOptions = {
          from: process.env.GMAIL_ACCOUNT,
          to: process.env.HOTMAIL_ACCOUNT,
          subject: `訂單編號：${data['Result']['MerchantOrderNo']} 付款成功`,
          text: `訂單編號：${data['Result']['MerchantOrderNo']} 付款成功`
        }
        return mailService.sendMail(mailOptions, (err, info) => {
          if (err) console.log(err)
          else console.log('Email sent: ' + info.response)
        })
      })
    })
  }

}

module.exports = orderController