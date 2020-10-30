const {pool} = require('../config')

const addCustomer = (request, response) => {
  const {name} = request.body

  pool.query(
    'INSERT INTO "CUSTOMER" (name) VALUES ($1)',
    [name],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Customer added.'})
    },
  )
}

const deleteCustomer = (request, response) => {
  const id = request.params.id;
  pool.query('DELETE FROM "CUSTOMER" WHERE ("ID" = $1) ', 
    [id],
    (error) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'success', message: 'Customer deleted.'})
  })
}

const getAllCustomers = (request, response) => {
  pool.query('SELECT * FROM "CUSTOMER"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
const getCustomer = (request, response) => {
  const id = request.params.id;
  pool.query('SELECT * FROM "CUSTOMER" WHERE ("ID" = $1)', 
    [id],
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows[0])
  })
}

const updateCustomer = (request, response) => {
  const {name} = request.body
  const id = request.params.id;
  pool.query(
    'UPDATE "CUSTOMER" SET name = $2 WHERE ("ID" = $1)',
    [id,name],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Customer updates.'})
    },
  )
}



module.exports = {
  addCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
};
