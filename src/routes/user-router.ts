import express, { Router } from 'express';
import { userSchemas } from '../validationSchemas/validateUser';
import { userController } from '../controllers';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/adminMiddleware';
import { validate } from '../middlewares/validate';

const router: Router = express.Router();

router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.post(
  '/',
  isAuthenticated,
  isAdmin,
  validate(userSchemas.createUserSchema),
  userController.createUser
);
router.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  validate(userSchemas.updateUserSchema),
  userController.updateUser
);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);
router.post(
  '/login',
  validate(userSchemas.loginUserSchema),
  userController.loginUser
);
router.put(
  '/tokens',
  validate(userSchemas.updateTokensSchema),
  userController.updateTokens
);

export default router;
