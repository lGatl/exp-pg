const {pool} = require('../config')

const addOrder = (request, response) => {
  const {name,customer_id} = request.body

  pool.query(
    'INSERT INTO "ORDER" (name, customer_id) VALUES ($1,$2)',
    [name, customer_id],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Order added.'})
    },
  )
}

const deleteOrder = (request, response) => {
  const id = request.params.id;
  pool.query('DELETE FROM "ORDER" WHERE ("ID" = $1) ', 
    [id],
    (error) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'success', message: 'Order deleted.'})
  })
}

const getAllOrders = (request, response) => {
  pool.query('SELECT * FROM "ORDER"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const getOrdersByCustomerId = (request, response) => {
  const customer_id = request.params.customer_id;
  pool.query('SELECT * FROM "ORDER" WHERE ("customer_id" = $1)', 
    [customer_id],
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const getOrder = (request, response) => {
  const id = request.params.id;
  pool.query('SELECT * FROM "ORDER" WHERE ("ID" = $1)', 
    [id],
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows[0])
  })
}

const updateOrder = (request, response) => {
  const {name,customer_id} = request.body;
  const id = request.params.id;
  pool.query(
    'UPDATE "ORDER" SET name = $2, customer_id = $3 WHERE ("ID" = $1)',
    [id,name, customer_id],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Order updates.'})
    },
  )
}



module.exports = {
  addOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  getOrdersByCustomerId,
  updateOrder
};



