import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { SupplierController } from './controllers/SupplierController';
import { ProductController } from './controllers/ProductController';
import { UserController } from './controllers/UserController';
import { StoreController } from './controllers/StoreController';
import { authMiddleware } from './middlewares/authMiddleware';

const routes = Router();

const authController = new AuthController();
const supplierController = new SupplierController();
const productController = new ProductController();
const userController = new UserController();
const storeController = new StoreController();

// Public Routes
routes.post('/login', authController.login);

// Protected Routes
routes.get('/me', authMiddleware, (req, res) => {
    res.json({ id: req.userId, email: req.userEmail });
});

// User Routes
routes.get('/users', authMiddleware, userController.list);
routes.post('/users', authMiddleware, userController.create);

// Store Routes
routes.get('/stores', authMiddleware, storeController.list);
routes.post('/stores', authMiddleware, storeController.create);

// Supplier Routes
routes.get('/suppliers', authMiddleware, supplierController.list);
routes.post('/suppliers', authMiddleware, supplierController.create);
routes.patch('/suppliers/:id/toggle-active', authMiddleware, supplierController.toggleActive);

// Product Routes
routes.get('/products', authMiddleware, productController.list);
routes.post('/products', authMiddleware, productController.create);

export { routes };
