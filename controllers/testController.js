require('dotenv').config()
const db = require('../models')
const { Order, Product } = db

// FOR LOAD TESTING
const testController = {
  testGetOrder: async (req, res) => {
    const order = await Order.findOne({
      where: {
        UserId: req.user.id,
        payment_status: 0
      }
    })
    res.json({ id: order.id })
  },

  testGetSN: async (req, res) => {
    const order = await Order.findOne({
      where: {
        UserId: req.user.id,
        payment_status: 0
      }
    })
    res.json({ sn: order.sn })
  },

  testPay: async (req, res) => {
    try {
      // use transaction
      const sequelize = db.sequelize
      const t1 = await sequelize.transaction({
        isolationLevel: 'SERIALIZABLE'
      })

      const order = await Order.findOne({
        where: { sn: req.body.sn },
        include: [{ model: Product, as: 'items' }]
      })

      // OrderItem ProductID    
      let idData = order.toJSON().items.map(item => item.id)

      // save ProductID and  OrderItem quantity
      let quantityMap = {}
      order.toJSON().items.forEach(item => {
        quantityMap[item.id] = item.OrderItem.quantity
      })

      const products = await Product.findAll({
        where: { id: idData },
        transaction: t1,
        lock: {
          level: t1.LOCK.UPDATE,
          of: Product
        }
      })

      for (let i = 0; i < idData.length; i++) {
        // get product stock and order quantity
        const stock = products[i].dataValues.stock
        const quantity = quantityMap[products[i].id]

        // complete payment if stock available
        if (stock - quantity >= 0) {
          await products[i].update({
            stock: stock - quantity
          }, { transaction: t1 })
          await order.update({
            payment_status: 1
          }, { transaction: t1 })

          // clear temp data after update
          idData = null
          quantityMap = {}
          await t1.commit()
        } else {
          // TODO: remove OrderItem if stock unavailable
          await t1.rollback()
          await order.update({ sn: null })
        }
        return res.redirect('/orders')
      }
    } catch (err) {
      console.log(err)
      await t1.rollback()
    }
  },

  getReport: (req, res) => {
    Product.findByPk(2).then(product => {
      Order.findAndCountAll({
        raw: true,
        nest: true
      }).then(orders => {
        if (orders.count < 0) return
        let snCount = 0
        let paymentCount = 0
        orders.rows.forEach(order => {
          if (order.sn !== null) snCount++
          if (order.payment_status === '1') paymentCount++
        })
        const stock = (product.toJSON().stock === 0) ? true : false
        snCount = (snCount === 20) ? true : false
        paymentCount = (paymentCount === 20) ? true : false
        return res.render('report', {
          stock,
          snCount,
          paymentCount
        })
      })
    })

  }

}

module.exports = testController