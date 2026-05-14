const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireAdmin, allowAdminOrOwner } = require('../middlewares/role.middleware');

const router = Router();

router.use(authenticate);
router.get('/', requireAdmin, userController.getAll);
router.get('/:id', allowAdminOrOwner, userController.getById);
router.post('/', requireAdmin, userController.create);
router.put('/:id', allowAdminOrOwner, userController.update);
router.delete('/:id', requireAdmin, userController.remove);

module.exports = router;
