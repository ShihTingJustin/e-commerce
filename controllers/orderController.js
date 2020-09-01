const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem

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
  }

}

module.exports = orderController