const Joi = require("joi")

const createProductSchema = Joi.object({
  name: Joi.string().min(3).required(),
  brand: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  isFeatured: Joi.boolean(),
  variants: Joi.array().items(
    Joi.object({
      sku: Joi.string().required(),
      size: Joi.string().required(),
      color: Joi.string().required(),
      price: Joi.number().required(),
      countInStock: Joi.number().required()
    })
  )
})

module.exports = {
  createProductSchema
}