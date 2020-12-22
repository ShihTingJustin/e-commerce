require('dotenv').config()
const db = require('../models')
const { Cart, CartItem, Order, OrderItem, Product } = db
const payService = require('../services/newebpay')
const mailService = require('../services/mail')

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({
      where: { UserId: req.user.id },
      include: [{
        model: Product, as: "items"
      }],
      order: [['updatedAt', 'DESC']]
    }).then(orders => {
      orders = orders.map(order => ({
        ...order.dataValues
      }))
      return res.render('orders', { orders })
    })
  },

  postOrder: (req, res) => {
    // create order
    Cart.findOne({
      where: { UserId: req.user.id },
      include: 'items'
    }).then(cart => {
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
        const cartItems = cart.dataValues.items
        for (let i = 0; i < cartItems.length; i++) {
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cartItems[i].dataValues.id,
              price: cartItems[i].dataValues.price,
              quantity: cartItems[i].dataValues.CartItem.dataValues.quantity
            })
          )
        }
        // clear cart after post order 
        Promise.all(results).then(() => {
          return CartItem.destroy({
            where: { CartId: cart.id }
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
    return Order.findByPk(req.params.id)
      .then(order => {
        const tradeInfo = payService.getTradeInfo(req.user.id, order.amount, '商品名稱', req.user.email)
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
    const data = JSON.parse(payService.create_mpg_aes_decrypt(req.body.TradeInfo))
    return Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } }).then(orders => {
      if (req.query.from === 'NotifyURL') { return res.status(200) }
      if (req.query.from === 'ReturnURL') {
        orders[0].update({
          ...req.body,
          payment_status: 1,
        }).then(() => {
          return res.redirect('/orders')
        }).then(() => {
          // send payment confirmation email
          let mailOptions = {
            from: process.env.GMAIL_ACCOUNT,
            to: req.user.email,
            subject: `訂單編號：${data['Result']['MerchantOrderNo']} 付款成功`,
            text: `訂單編號：${data['Result']['MerchantOrderNo']} 付款成功`
          }
          return mailService.sendMail(mailOptions, (err, info) => {
            if (err) console.log(err)
          })
        })
      }
    })
  }

}

module.exports = orderController