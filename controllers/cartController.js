const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const PAGE_LIMIT = 10
const PAGE_OFFSET = 0

const cartController = {
  getCart: (req, res) => {
    Cart.findByPk(req.session.cartId, {include: 'items'})
    .then(cart => {
      cart = cart ? cart.toJSON() : {items: []}      
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart,
        totalPrice
      })
    })
  },

  postCart: (req, res) => {
    return Cart.findOrCreate({   // cart exist or not
      where: {
        id: req.session.cartId || 0
      }
    }).spread((cart, created) => {   // without product in cart so create
      return CartItem.findOrCreate({    
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId
        }
      }).spread((cartItem, created) => {    // with product in cart so adjust quantity of product
        return cartItem.update({
          quantity: (cartItem.quantity || 0) + 1
        })
        .then(cartItem => {
          req.session.cartId = cart.id
          return req.session.save(() => {
            return res.redirect('back')
          })
        })
      })
    })
  }

}

module.exports = cartController