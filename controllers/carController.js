const {pool} = require('../config')

const addCar = (request, response) => {
  const {name,order_id} = request.body

  pool.query(
    'INSERT INTO "CAR" (name,order_id) VALUES ($1, $2)',
    [name,order_id],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Car added.'})
    },
  )
}

const deleteCar = (request, response) => {
  const id = request.params.id;
  pool.query('DELETE FROM "CAR" WHERE ("ID" = $1) ', 
    [id],
    (error) => {
    if (error) {
      throw error
    }
    response.status(201).json({status: 'success', message: 'Car deleted.'})
  })
}

const getAllCars = (request, response) => {
  pool.query('SELECT * FROM "CAR"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCarsByOrderId = (request, response) => {
  const order_id = request.params.order_id;
  pool.query('SELECT * FROM "CAR" WHERE ("order_id" = $1)', 
    [order_id],
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCar = (request, response) => {
  const id = request.params.id;
  pool.query('SELECT * FROM "CAR" WHERE ("ID" = $1)', 
    [id],
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows[0])
  })
}

const updateCar = (request, response) => {
  const {name,order_id} = request.body
  const id = request.params.id;
  pool.query(
    'UPDATE "CAR" SET name = $2, order_id = $3  WHERE ("ID" = $1)',
    [id,name,order_id],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Car updates.'})
    },
  )
}



module.exports = {
  addCar,
  deleteCar,
  getAllCars,
  getCarsByOrderId,
  getCar,
  updateCar,
};




