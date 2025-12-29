import { Router } from 'express';
import { createUser, listUsers, updateUser, deleteUser, loginUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateZod, validateZodParam, validateZodQuery } from '../middleware/validateZod.js';
import { userSchema } from '../validation/userSchema.js';
import { idParamSchema, userQuerySchema } from '../validation/paramSchemas.js';

const router = Router();

// POST /users - Create a new user (signup)
router.post('/users', validateZod(userSchema), createUser);


// GET /users - List all users (protected, with query validation)
router.get('/users', authMiddleware, validateZodQuery(userQuerySchema), listUsers);


// Update user by ID (protected, with param validation)
router.put('/users/:id', authMiddleware, validateZodParam(idParamSchema), validateZod(userSchema), updateUser);


// Delete user by ID (protected, with param validation)
router.delete('/users/:id', authMiddleware, validateZodParam(idParamSchema), deleteUser);

// POST /users/login - User login
router.post('/login', loginUser);

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: (req as any).user });
});

export default router;
