const dealsRouter = require('express').Router()
const Deal = require('../models/Deal')

dealsRouter.get('/', (request, response) => {
  Deal.find({}).then(Deals => {
    response.json(Deals)
  })
})

dealsRouter.get('/:id', (request, response, next) => {
  Deal.findById(request.params.id)
    .then(Deal => {
      if (Deal) {
        response.json(Deal)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

dealsRouter.post('/', (request, response, next) => {
  const body = request.body

  const Deal = new Deal({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  Deal.save()
    .then(savedDeal => {
      response.json(savedDeal)
    })
    .catch(error => next(error))
})

dealsRouter.delete('/:id', (request, response, next) => {
  Deal.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

dealsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const Deal = {
    content: body.content,
    important: body.important,
  }

  Deal.findByIdAndUpdate(request.params.id, Deal, { new: true })
    .then(updatedDeal => {
      response.json(updatedDeal)
    })
    .catch(error => next(error))
})

module.exports = dealsRouter