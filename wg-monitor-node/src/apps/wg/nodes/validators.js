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
  outerInterfaceName: Joi.string().required().min(3).max(50).messages({
    'string.base': 'El nombre de la interfaz externa debe ser una cadena de texto.',
    'string.min': 'El nombre de la interfaz externa debe tener al menos 3 caracteres.',
    'string.max': 'El nombre de la interfaz externa no puede superar los 50 caracteres.',
    'any.required': 'El nombre de la interfaz externa es obligatorio.'
  }),
  networkSegment: Joi.string().required().messages({
    'string.base': 'El segmento de red debe ser una cadena de texto.',
    'any.required': 'El segmento de red es obligatorio.'
  }),
  access: Joi.string().valid('PUBLIC', 'PRIVATE').default('PUBLIC').messages({
    'any.only': 'El acceso debe ser "PUBLIC" o "PRIVATE".'
  }),
  interfaceName: Joi.string().required().default('wg0').messages({
    'string.base': 'El nombre de la interfaz debe ser una cadena de texto.',
    'any.required': 'El nombre de la interfaz es obligatorio.'
  }),
  publicAddress: Joi.string().ip().required().messages({
    'string.base': 'La dirección pública debe ser una dirección IP válida.',
    'string.ip': 'La dirección pública debe ser una dirección IP válida.',
    'any.required': 'La dirección pública es obligatoria.'
  }),
  interfaceAddress: Joi.string().ip().required().messages({
    'string.base': 'La dirección de la interfaz debe ser una dirección IP válida.',
    'string.ip': 'La dirección de la interfaz debe ser una dirección IP válida.',
    'any.required': 'La dirección de la interfaz es obligatoria.'
  }),
  privateKey: Joi.string().required().messages({
    'string.base': 'La clave privada debe ser una cadena de texto.',
    'any.required': 'La clave privada es obligatoria.'
  }),
  publicKey: Joi.string().required().messages({
    'string.base': 'La clave pública debe ser una cadena de texto.',
    'any.required': 'La clave pública es obligatoria.'
  }),
  presharedKey: Joi.string().required().messages({
    'string.base': 'La clave precompartida debe ser una cadena de texto.',
    'any.required': 'La clave precompartida es obligatoria.'
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
  address: Joi.string().ip().required().messages({
    'string.base': 'La dirección IP debe ser una cadena de texto.',
    'string.ip': 'La dirección IP debe ser válida.',
    'any.required': 'La dirección IP es obligatoria.'
  }),
  interfaceName: Joi.string().default('wg0').messages({
    'string.base': 'El nombre de la interfaz debe ser una cadena de texto.',
    'any.required': 'El nombre de la interfaz es obligatorio.'
  }),
  outerInterfaceName: Joi.string().default('eth0').messages({
    'string.base': 'El nombre de la interfaz externa debe ser una cadena de texto.',
    'any.required': 'El nombre de la interfaz externa es obligatorio.'
  }),
  sharedNetwork: Joi.string().optional().messages({
    'string.base': 'La red compartida debe ser una cadena de texto.'
  }),
  nodeType: Joi.string().valid('CLIENT', 'GATEWAY', 'ROUTER').required().messages({
    'any.only': 'El tipo de nodo debe ser CLIENT, GATEWAY o ROUTER.',
    'any.required': 'El tipo de nodo es obligatorio.'
  }),
  privateKey: Joi.string().required().messages({
    'string.base': 'La clave privada debe ser una cadena de texto.',
    'any.required': 'La clave privada es obligatoria.'
  }),
  publicKey: Joi.string().required().messages({
    'string.base': 'La clave pública debe ser una cadena de texto.',
    'any.required': 'La clave pública es obligatoria.'
  }),
  presharedKey: Joi.string().required().messages({
    'string.base': 'La clave precompartida debe ser una cadena de texto.',
    'any.required': 'La clave precompartida es obligatoria.'
  }),
  gatewayId: Joi.string().uuid().required().messages({
    'string.base': 'El ID del gateway debe ser un UUID.',
    'any.required': 'El ID del gateway es obligatorio.'
  }),
  enabled: Joi.boolean().default(true).messages({
    'boolean.base': 'El estado de habilitación debe ser un valor booleano.',
    'any.required': 'El estado de habilitación es obligatorio.'
  }),
  ownerId: Joi.string().uuid().required().messages({
    'string.base': 'El ID del propietario debe ser un UUID.',
    'any.required': 'El ID del propietario es obligatorio.'
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
    createUpdateSchema,
    validateData
};
