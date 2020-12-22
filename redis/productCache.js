const db = require('../models')
const { Product } = db
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

(async () => {
  await Product.findAll({
    raw: true,
    nest: true
  }).then(products => {
    products.forEach(product =>
      client.set(product.id, JSON.stringify(product))
    )
  }).catch(err => console.log(err))
  const productCacheArr = []
  const keys = await client.keys('*')
  const redisArr = await client.mget(...keys)
  redisArr.forEach(product => productCacheArr.push(JSON.parse(product)))
  console.log('Cache Completed !')
})()
