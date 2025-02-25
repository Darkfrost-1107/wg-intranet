function authMiddleWare(req, res, next) {
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

global.auth = {
  authMiddleWare,
  includeRoles,
  excludeRoles,
  hasOwnership
}