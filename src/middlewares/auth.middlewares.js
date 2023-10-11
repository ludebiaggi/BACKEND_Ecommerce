// MDW de autorización para roles USUARIO y ADMIN.

export function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'ADMIN') {
      next(); 
    } else {
      res.status(403).json({ error: 'No tenés los permisos para realizar ésta operación'});
    }
};
  
export function isUser(req, res, next) {
  if (req.session.user && req.session.user.role === 'usuario') {
      next(); 
    } else {
      res.status(403).json({ error: 'No tenés los permisos para realizar ésta operación' });
    }
};
  