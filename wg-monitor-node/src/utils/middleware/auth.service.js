/**
 * @file auth.service.js
 * @description Servicio de autenticación
 * Resumen de todo lo relacionado a la autenticación 
 */

const crypto = require('crypto-js');

/**
 * Middleware de autenticación por sesion
 * 
*/



function sessionAuth(req, res, next) {
  const { user } = req.session;
  if (!user || !user.authenticated) {
    res.status(401).json({
      detail: 'Unauthenticated',
      authenticated: false,
    });
    return;
  }
  next();
}

/**
 * Middleware de autenticación por roles (INCLUSION)
 */

function includeRoles(allowedRoles) {
  return (req, res, next) => {
    const { roles } = req.session.user;
    console.log(roles)
    for (let role of allowedRoles) {
      if (roles.includes(role)) {
        next();
        return;
      }
    }

    res.status(403).json({
      detail: 'Unauthorized',
      authenticated: true,
      authorized: false,
    });
  }
}

/**
 * Middleware de autenticación por roles (EXCLUSION)
 */
function excludeRoles(excludedRoles) {
  return (req, res, next) => {
    const { roles } = req.session.user;
    for (let role of excludedRoles) {
      if (roles.includes(role)) {
        res.status(403).json({
          detail: 'Unauthorized',
          authenticated: true,
          authorized: false,
        });
        return;
      }
    }

    next();
  }
}

/**
 * Middleware de autenticación por propiedad de ownership a los recursos
 */
function hasOwnership(req, res, next){
  const { user } = req.session;
  const { id, owner } = req.params;
  if(user.roles.includes("SUPERADMIN")){
    next();
    return;
  }
  if(owner === user.id){
    next();
    return;
  }
  if(!owner && id === user.id){
    next();
    return;
  }
  res.status(403).json({
    detail: 'Unauthorized',
    authenticated: true,
    authorized: false,
  });
}

/**
 * Middleware de autenticación básica
 * 
 * * Ideal para login de usuarios
 * * Se recomienda usar con HTTPS
 */

async function basicAuth(req, res, next){
  const client = db.CreateClient().user

  const {username, password} = req.body;
  const pw = crypto.SHA256(password).toString()

  console.log(password, " : ",pw)
  const user = await client.findFirst({
    where: {username, password:pw },
    omit: {
      password: true
    }
  })
  if(user){
    req.session.user = { ...user,
      authenticated: true,
    };
    next();
    return;
  }

  res.status(403).json({
    detail: 'NotAuthenticated',
    authenticated: false,
    authorized: false,
  });
}


async function APIAuth(req, res, next){
  const client = db.CreateClient().user

  const{apiToken} = req.headers;
  const user = await client.findFirst({
    where:
    {
      apiToken
    },
    omit: {
      password: true
    }
  });
  if(user){
    req.session.user = { ...user,
      authenticated: true,
    };
    next();
    return;
  }
  res.status(403).json({
    detail: 'NotAuthenticated',
    authenticated: false,
    authorized: false,
  });
}  

global.auth = {
  sessionAuth,
  includeRoles,
  excludeRoles,
  hasOwnership,
  basicAuth,
  APIAuth,
}