const db = require('../models')
const redis = require('redis')
const client = redis.createClient()
const { promisify } = require("util")
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)
const randomkeyAsync = promisify(client.randomkey).bind(client)
const keysAsync = promisify(client.keys).bind(client)
const mgetAsync = promisify(client.mget).bind(client)

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
    const cacheCheck = new Promise((resolve, reject) => {
      randomkeyAsync().then(cache => resolve(cache))
        .catch(err => reject(err))
    })

    const saveProductsToRedis = function () {
      return new Promise((resolve, reject) => {
        return Product.findAll({
          raw: true,
          nest: true
        }).then(products => {
          products.forEach(product => {
            setAsync(product.id, JSON.stringify(product))
            return resolve(true)
          })
        }).catch(err => reject(err))
      })
    }

    const getKeys = function () {
      return new Promise((resolve, reject) => {
        keysAsync('*')
          .then(keys => {
            resolve(keys)
          }).catch(err => reject(err))
      })
    }

    const getRedisProducts = function (keys) {
      return new Promise((resolve, reject) => {
        mgetAsync(...keys).then(products => {
          const productsCache = []
          products.forEach(product => productsCache.push(JSON.parse(product)))
          resolve(productsCache)
        }).catch(err => reject(err))
      })
    }

    async function useRedisCache() {
      try {
        if (!await cacheCheck) {
          if (await saveProductsToRedis()) {
            const keys = await getKeys()
            if (keys) {
              const productsCache = await getRedisProducts(keys)
              return Cart.findByPk(req.session.cartId, { include: 'items' })
                .then(cart => {
                  cart = cart ? cart.toJSON() : { items: [] }
                  let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
                  return res.render('products', {
                    products: productsCache,
                    cart,
                    totalPrice
                  })
                }).catch(err => console.log(err))
                .then(() => console.log('Cache Completed !'))
            }
          }
        }

        const keys = await getKeys()
        if (keys) {
          const productsCache = await getRedisProducts(keys)
          return Cart.findByPk(req.session.cartId, { include: 'items' })
            .then(cart => {
              cart = cart ? cart.toJSON() : { items: [] }
              let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
              return res.render('products', {
                products: productsCache,
                cart,
                totalPrice
              })
            }).catch(err => console.log(err))
            .then(() => console.log('Cache is existed, Just read !'))
        }
      } catch (error) {
        console.log(error)
      }
    }

    useRedisCache()
  }

}

module.exports = productController