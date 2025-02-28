const Joi = require('joi');

// Esquema de validación para ProviderNode
const providerNodeSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    'string.base': 'El nombre debe ser una cadena de texto.',
    'string.min': 'El nombre debe tener al menos 3 caracteres.',
    'string.max': 'El nombre no puede tener más de 100 caracteres.',
    'any.required': 'El nombre es obligatorio.'
  }),
  listenPort: Joi.number().integer().min(1).max(65535).default(51820).messages({
    'number.base': 'El puerto debe ser un número.',
    'number.integer': 'El puerto debe ser un número entero.',
    'number.min': 'El puerto debe ser mayor o igual a 1.',
    'number.max': 'El puerto debe ser menor o igual a 65535.',
    'any.required': 'El puerto es obligatorio.'
  }),
  dns: Joi.string().ip().optional().messages({
    'string.base': 'El DNS debe ser una cadena de texto.',
    'string.ip': 'El DNS debe ser una dirección IP válida.'
  }),
  mtu: Joi.number().integer().min(1280).max(9000).default(1420).messages({
    'number.base': 'El valor MTU debe ser un número.',
    'number.integer': 'El valor MTU debe ser un número entero.',
    'number.min': 'El valor MTU debe ser mayor o igual a 1280.',
    'number.max': 'El valor MTU debe ser menor o igual a 9000.'
  }),
  allowedIPs: Joi.string().optional().messages({
    'string.base': 'La lista de direcciones IP permitidas debe ser una cadena de texto.'
  }),
  outerInterfaceName: Joi.string().min(3).max(50).messages({
    'string.base': 'El nombre de la interfaz externa debe ser una cadena de texto.',
    'string.min': 'El nombre de la interfaz externa debe tener al menos 3 caracteres.',
    'string.max': 'El nombre de la interfaz externa no puede superar los 50 caracteres.',
  }),
  networkSegment: Joi.string().messages({
    'string.base': 'El segmento de red debe ser una cadena de texto.',
  }),
  access: Joi.string().valid('PUBLIC', 'PRIVATE').default('PUBLIC').messages({
    'any.only': 'El acceso debe ser "PUBLIC" o "PRIVATE".'
  }),
  interfaceName: Joi.string().default('wg0').messages({
    'string.base': 'El nombre de la interfaz debe ser una cadena de texto.',
  }),
  publicAddress: Joi.string().ip().messages({
    'string.base': 'La dirección pública debe ser una dirección IP válida.',
    'string.ip': 'La dirección pública debe ser una dirección IP válida.',
  }),
  interfaceAddress: Joi.string().ip().messages({
    'string.base': 'La dirección de la interfaz debe ser una dirección IP válida.',
    'string.ip': 'La dirección de la interfaz debe ser una dirección IP válida.',

  }),
  privateKey: Joi.forbidden().messages({
    'string.base': 'La clave privada debe ser una cadena de texto.',

  }),
  publicKey: Joi.forbidden().messages({
    'string.base': 'La clave pública debe ser una cadena de texto.',

  }),
  presharedKey: Joi.forbidden().messages({
    'string.base': 'La clave precompartida debe ser una cadena de texto.',
  })
});

// Esquema de validación para ClientNode
const clientNodeSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    'string.base': 'El nombre debe ser una cadena de texto.',
    'string.min': 'El nombre debe tener al menos 3 caracteres.',
    'string.max': 'El nombre no puede tener más de 100 caracteres.',
    'any.required': 'El nombre es obligatorio.'
  }),
  address: Joi.string().ip().messages({
    'string.base': 'La dirección IP debe ser una cadena de texto.',
    'string.ip': 'La dirección IP debe ser válida.',
  }),
  interfaceName: Joi.string().default('wg0').messages({
    'string.base': 'El nombre de la interfaz debe ser una cadena de texto.',
  }),
  outerInterfaceName: Joi.string().default('eth0').messages({
    'string.base': 'El nombre de la interfaz externa debe ser una cadena de texto.',
  }),
  sharedNetwork: Joi.string().allow(null).optional().messages({
    'string.base': 'La red compartida debe ser una cadena de texto.'
  }),
  nodeType: Joi.string().valid('CLIENT', 'GATEWAY', 'ROUTER').messages({
    'any.only': 'El tipo de nodo debe ser CLIENT, GATEWAY o ROUTER.',
  }),
  privateKey: Joi.forbidden().messages({
    'string.base': 'La clave privada debe ser una cadena de texto.',

  }),
  publicKey: Joi.forbidden().messages({
    'string.base': 'La clave pública debe ser una cadena de texto.',

  }),
  presharedKey: Joi.forbidden().messages({
    'string.base': 'La clave precompartida debe ser una cadena de texto.',

  }),
  gatewayId: Joi.forbidden().messages({
    'forbidden.base': 'El ID del gateway no puede ser modificado.',

  }),
  enabled: Joi.boolean().default(true).messages({
    'boolean.base': 'El estado de habilitación debe ser un valor booleano.',
  
  }),
  ownerId: Joi.forbidden().messages({
    'forbidden.base': 'El ID del propietario no puede ser modificado.',

  })
});

const validateData = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(err => err.message);
    return res.status(400).json({
      detail: 'Validation Error',
      errors: errorMessages
    });
  }
  next();
};

module.exports = {
    providerNodeSchema,
    clientNodeSchema ,
    validateData
};
