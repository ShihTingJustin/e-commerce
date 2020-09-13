const db = require('../models')
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const Product = db.Product
const Cart = db.Cart
const PAGE_LIMIT = 10
const PAGE_OFFSET = 0


const productController = {
  getProducts: (req, res) => {
    Product.findAndCountAll({
      raw: true,
      nest: true,
      offset: PAGE_OFFSET,
      limit: PAGE_LIMIT
    })
      .then(products => {
        return Cart.findByPk(req.session.cartId, { include: 'items' })
          .then(cart => {
            cart = cart ? cart.toJSON() : { items: [] }
            let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', {
              products,
              cart,
              totalPrice
            })
          })
      })
  },

  getProductsR: (req, res) => {
    const getProductsRedisAsync = async () => {
      const cacheCheck = await client.randomkey()
      if (!cacheCheck) {
        await Product.findAll({
          raw: true,
          nest: true
        }).then(products => {
          products.forEach(product =>
            client.set(product.id, JSON.stringify(product))
          )
        }).catch(err => console.log(err))
        const redisCache = []
        const keys = await client.keys('*')
        const redisArr = await client.mget(...keys)
        redisArr.forEach(product => redisCache.push(JSON.parse(product)))

        return Cart.findByPk(req.session.cartId, { include: 'items' })
          .then(cart => {
            cart = cart ? cart.toJSON() : { items: [] }
            let totalPrice = cart.items.length > 0 ? cart.items.map(itm => itm.price * itm.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', {
              products: redisCache,
              cart,
              totalPrice
            })
          }).catch(err => console.log(err))
          .then(() => console.log('Cache Completed !'))
      } else {
        const redisCache = []
        const keys = await client.keys('*')
        const redisArr = await client.mget(...keys)
        redisArr.forEach(product => redisCache.push(JSON.parse(product)))
        return Cart.findByPk(req.session.cartId, { include: 'items' })
          .then(cart => {
            cart = cart ? cart.toJSON() : { items: [] }
            let totalPrice = cart.items.length > 0 ? cart.items.map(itm => itm.price * itm.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', {
              products: redisCache,
              cart,
              totalPrice
            })
          }).catch(err => console.log(err))
          .then(() => console.log('Cache is existed, Just read !'))
      }
    }

    getProductsRedisAsync()
  }

}

module.exports = productController