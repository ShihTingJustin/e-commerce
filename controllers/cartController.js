const db = require('../models')
const { Cart, CartItem, Product } = db
const PAGE_LIMIT = 10
const PAGE_OFFSET = 0

const cartController = {
  getCart: (req, res) => {
    CartItem.findAll({
      raw: true,
      nest: true,
      where: { UserId: req.user.id },
      include: [Product]
    }).then(cartItems => {
      console.log(cartItems)
      let totalPrice = cartItems.length > 0 ? cartItems.map(item => item.Product.price * item.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cartItems,
        totalPrice: Number(totalPrice).toLocaleString(),
        cartEmptyPage: 1
      })
    })
    // getCart: (req, res) => {
    //   Cart.findByPk(req.session.cartId, { include: 'items' })
    //     .then(cart => {
    //       cart = cart ? cart.toJSON() : { items: [] }
    //       let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
    //       return res.render('cart', {
    //         cart,
    //         totalPrice: Number(totalPrice).toLocaleString(),
    //         cartEmptyPage: 1
    //       })
    //     })
  },

  postCart: (req, res) => {
    Cart.findOrCreate({   // cart exist or not
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
        }).then(cartItem => {
          req.session.cartId = cart.id
          return cartItem.save()
        })
          .then(cartItem => {
            if (req.user) {
              req.session.cartId = req.user.id
              return req.session.save(() => {
                return res.redirect('back')
              })
            }
            return res.redirect('back')
          })
      })
    })
  },

  addCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.update({
          quantity: cartItem.quantity + 1
        })
      })
      .then(() => {
        return res.redirect('back')
      })
  },

  subCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.update({
          quantity: (cartItem.quantity > 1) ? cartItem.quantity - 1 : 1
        })
      })
      .then(() => {
        return res.redirect('back')
      })
  },

  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  }

}

module.exports = cartController