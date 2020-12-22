const db = require('../models')
const { Cart, CartItem } = db

const cartController = {
  getCart: (req, res) => {
    Cart.findOne({
      where: { UserId: req.user.id },
      include: 'items'
    }).then(cart => {
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart,
        totalPrice: Number(totalPrice).toLocaleString(),
        cartEmptyPage: 1
      })
    })
  },

  postCart: (req, res) => {
    let where1 = {}
    if (!req.user) where1['id'] = req.session.cartId || 0
    if (req.user) where1['UserId'] = req.user.id
    return Cart.findOrCreate({   // check cart exist or not
      where: where1
    }).spread(cart => {   // without product in cart so create
      return CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId
        }
      }).spread(cartItem => {    // with product in cart so adjust quantity of product
        return cartItem.update({
          quantity: (cartItem.quantity || 0) + 1
        }).then(() => {
          req.session.cartId = cart.id
          return req.session.save(() => {
            req.flash('success_msg', '商品成功放入購物車！')
            return res.redirect('back')
          })
        }).catch(err => console.log(err))
      })
    })

  },

  patchCartItem: (req, res) => {
    const input = Object.keys(req.body)[0]

    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        if (input === 'add')
          cartItem.update({
            quantity: cartItem.quantity + 1
          })

        if (input === 'sub') {
          cartItem.update({
            quantity: (cartItem.quantity > 1) ? cartItem.quantity - 1 : 1
          })
        }
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