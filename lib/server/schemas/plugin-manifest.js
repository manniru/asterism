'use strict'

import Joi from 'joi'

const serverSchema = Joi.object().keys({
  middlewares: Joi.func().maxArity(1).optional(),
  publicSockets: Joi.array().optional() // TODO !0: more precisely (array of strings)
}).unknown()

const browserSchema = Joi.object().keys({
  components: Joi.array().optional(),
  settingsPanel: Joi.string().optional(),
  publicSockets: Joi.array().optional() // TODO !0: more precisely (array of strings)
}).unknown()

const schema = Joi.object().keys({
  name: Joi.string().min(2).max(32).required(),
  version: [
    Joi.number().integer().min(20170101).max(20421231).required(),
    Joi.string().regex(/^[0-9]{1,8}\.[0-9]{1,8}\.[0-9]{1,8}$/).required()
  ],
  privateSocket: Joi.boolean().required().default(false),
  server: serverSchema.required(),
  browser: browserSchema.required()
}).unknown()

export default schema
