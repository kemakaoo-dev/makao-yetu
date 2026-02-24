const requireRole = (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return next({ statusCode: 401, message: "Not authorized" });
      }
  
      if (req.user.role !== role) {
        return next({ statusCode: 403, message: "Access denied" });
      }
  
      next();
    };
  };
  
  module.exports = requireRole;