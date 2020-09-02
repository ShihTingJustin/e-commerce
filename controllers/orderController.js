const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PW
  }
})

const orderController = {
  getOrders: (req, res) => {
    Order.findAll({
      raw: true,
      nest: true,
      includes: 'items'
    })
      .then(orders => {
        return res.render('orders', { orders })
      })
  },

  postOrder: (req, res) => {
    // create order
    Cart.findByPk(req.body.cartId, { include: 'items' })
      .then(cart => {
        const { name, address, phone, shipping_status, payment_status, amount } = req.body
        return Order.create({
          name,
          address,
          phone,
          shipping_status,
          payment_status,
          amount
        }).then(order => {    // put product in order from cart
          let results = []
          for (let i = 0; i < cart.items.length; i++) {
            // console.log(order.id, cart.items[i].id)
            results.push(
              OrderItem.create({
                OrderId: order.id,
                ProductId: cart.items[i].id,
                price: cart.items[i].price,
                quantity: cart.items[i].CartItem.quantity
              })
            )
          }
          // clear cart after order finish
          Promise.all(results).then(() => {
            return CartItem.destroy({
              where: { cartId: req.body.cartId }
            })
          }).then(() => { return res.redirect('/orders') })
            .then(() => {
              // send order confirmation email
              let mailOptions = {
                from: process.env.GMAIL_ACCOUNT,
                to: process.env.GMAIL_ACCOUNT,
                subject: `${order.id} 訂單成立`,
                text: `${order.id} 訂單成立`
              }

              return transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log('Email sent: ' + info.response)
                }
              })
            })
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
    console.log('===== getPayment =====')
    console.log(req.params.id)
    console.log('==========')

    return Order.findByPk(req.params.id)
      .then(order => {
        return res.render('payment', { order })
      })
  },

  newebpayCallback: (req, res) => {
    console.log('===== newebpayCallback =====')
    console.log(req.body)
    console.log('==========')

    return res.redirect('back')
  }

}

module.exports = orderController