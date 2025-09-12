//backend\middleware\isAdmin.js

// Only the super admin can access
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.email !== 'trysamrat1@gmail.com') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = isAdmin;
