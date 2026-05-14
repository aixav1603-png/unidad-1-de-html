function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Acceso denegado. Solo administradores pueden realizar esta acción.'
    });
  }
  next();
}

function allowAdminOrOwner(req, res, next) {
  const requestedId = Number(req.params.id);
  const currentId = Number(req.user && req.user.id);

  if (!req.user) {
    return res.status(401).json({ ok: false, message: 'No autorizado.' });
  }

  if (req.user.role === 'admin' || requestedId === currentId) {
    return next();
  }

  return res.status(403).json({
    ok: false,
    message: 'Acceso denegado. Solo administradores o el propio usuario pueden acceder a este recurso.'
  });
}

module.exports = {
  requireAdmin,
  allowAdminOrOwner
};
