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
    // TODO 29 30 要包進去 try
    const sequelize = db.sequelize
    const t1 = await sequelize.transaction({
      isolationLevel: 'SERIALIZABLE'
    })
    try {
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

  // testPay: async (req, res) => {
  //   try {
  //     const order = await Order.findOne({
  //       where: { sn: req.body.sn },
  //       include: [
  //         { model: Product, as: 'items' }
  //       ]
  //     })
  //     // OrderItem ProductID    
  //     let idData = await order.toJSON().items.map(item => item.id)

  //     // save ProductID and  OrderItem quantity
  //     let quantityMap = {}
  //     order.toJSON().items.forEach(item => {
  //       quantityMap[item.id] = item.OrderItem.quantity
  //     })

  //     const products = await Product.findAll({
  //       where: { id: idData }
  //     })

  //     for (let i = 0; i < idData.length; i++) {

  //       const stock = products[i].dataValues.stock
  //       const quantity = quantityMap[products[i].id]

  //       // complete payment if stock available
  //       if (stock - quantity > 0) {
  //         await products[i].update({ stock: stock - quantity })
  //         await order.update({ payment_status: 1 })
  //         // clear temp data after update
  //         idData = null
  //         quantityMap = {}
  //         return res.redirect('/orders')
  //       } else {
  //         // TODO: remove OrderItem if stock unavailable
  //         return res.redirect('/orders')
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

}

module.exports = testController