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
      let totalPrice = cartItems.length > 0 ? cartItems.map(item => item.Product.price * item.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cartItems,
        totalPrice: Number(totalPrice).toLocaleString(),
        cartEmptyPage: 1
      })
    })
  },

  postCart: (req, res) => {
    return (async () => {
      try {
        // find cart or create cart
        const cart = await Cart.findOrCreate({
          where: { id: req.session.cartId || null }
        })
        // put product into cart
        const CartId = cart[0].id
        const ProductId = req.body.productId
        const cartItem = await CartItem.findOrCreate({
          where: { CartId, ProductId },
          default: { CartId, ProductId }
        })
        // adjust cartItem quantity 
        await cartItem[0].update({
          quantity: (cartItem.quantity || 0) + 1
        })

        if (req.user) {
          req.session.cartId = req.user.id
          await req.session.save()
        } else {
          req.session.cartId = CartId
          await cartItem[0].save()
        }
        return res.redirect('back')
      } catch (err) {
        console.log(err)
      }
    })()

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