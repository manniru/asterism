'use strict'

import Joi from 'joi'

const schema = Joi.object().keys({
  min: Joi.number().integer().min(0).max(511).required().default(1),
  max: Joi.number().integer().min(1).max(512).required().default(3)
})

export default schema
