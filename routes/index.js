var express = require('express');
var router = express.Router();
var User = require('../models/users'); // Import the User model
const Message = require('../models/message');
const Product = require('../models/product');
const mongoose = require('mongoose');

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    }
    res.redirect('/login');
}

// GET root page
router.get('/', function(req, res, next) {
    res.render('home', { title: "Johann'S" });
});

// GET home page
router.get('/home', function(req, res, next) {
    res.render('home', { title: "Johann'S" });
});

// GET About Us page
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About Us' });
});

// GET Menu page
router.get('/menu', async (req, res) => {
    try {
        const cakes = await Product.find({ Type: 'Cake' }).exec();
        const brownies = await Product.find({ Type: 'Brownies' }).exec();
        const cookies = await Product.find({ Type: 'Cookies' }).exec();
        const cupcakes = await Product.find({ Type: 'Cupcakes' }).exec();

        res.render('menu', { 
            title: 'Menu',
            products: {
                Cakes: cakes,
                Brownies: brownies,
                Cookies: cookies,
                Cupcakes: cupcakes
            }
        });
    } catch (err) {
        console.error("Error in /menu route:", err);
        res.status(500).send('Internal Server Error');
    }
});

// GET Testimonials page
router.get('/testimonials', function(req, res, next) {
    res.render('maintenance', { title: 'Under Maintenance' });
});

// GET Reseller page
router.get('/reseller', function(req, res, next) {
    res.render('maintenance', { title: 'Under Maintenance' });
});

// GET Maintenance page
router.get('/maintenance', function(req, res, next) {
    res.render('maintenance', { title: 'Under Maintenance' });
});

// GET Contact page
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact' });
});

router.post('/contact', (req, res, next) => {
    const newMessage = new Message({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        emailAddress: req.body.emailAddress,
        message: req.body.message
    });

    newMessage.save()
        .then(savedMessage => {
            res.redirect('/contact');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error sending the message');
        });
});

// Login Route
router.get('/login', (req, res) => {
    if (req.session.isLoggedIn) {
        // If the user is already logged in, redirect to the home page
        res.redirect('/');
    } else {
        // If the user is not logged in, show the login page
        res.render('login', { title: 'Login' });
    }
});


// Handle user login (POST request)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password }).exec();

        if (!user) {
            // If user not found, render login page with error
            res.render('login', { title: 'Login', error: 'Invalid credentials. Try again.' });
        } else {
            // Set session variables
            req.session.isLoggedIn = true;
            req.session.userId = user._id;
            console.log(req.session)
            // Redirect to a new page after successful login
            res.redirect('/'); // Or any other page you want to redirect to
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Shop Route
router.get('/shop', ensureAuthenticated, async (req, res) => {
    try {
        const products = await Product.find({}).exec();
        res.render('shop', { title: 'Shop', products: products });
    } catch (err) {
        console.error("Error in /shop route:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Cart Route
router.get('/cart', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('cart.product').exec();
        let subtotal = 0;
        user.cart.forEach(item => {
            subtotal += item.product.Cost * item.quantity;
        });
        const tax = subtotal * 0.13;
        const total = subtotal + tax;

        res.render('cart', {
            title: 'Cart',
            cart: user.cart,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        });
    } catch (err) {
        console.error("Error in /cart route:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Add to Cart Route
router.post('/add-to-cart/:productId', ensureAuthenticated, async (req, res) => {
    const productId = req.params.productId;
    try {
        const user = await User.findById(req.session.userId);
        const productIndex = user.cart.findIndex(item => item.product.toString() === productId);
        
        if (productIndex > -1) {
            user.cart[productIndex].quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1 });
        }
        await user.save();
        res.redirect('/shop');
    } catch (err) {
        console.error("Error in /add-to-cart route:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Update Cart Route
router.post('/update-cart/:productId', ensureAuthenticated, async (req, res) => {
    const productId = req.params.productId;
    const { quantity } = req.body;

    try {
        const user = await User.findById(req.session.userId);
        const productIndex = user.cart.findIndex(item => item.product.toString() === productId);
        
        if (productIndex > -1 && quantity > 0) {
            user.cart[productIndex].quantity = quantity;
            await user.save();
        }
        res.redirect('/cart');
    } catch (err) {
        console.error("Error in /update-cart route:", err);
        res.status(500).send('Internal Server Error');
    }
});

// POST route to remove an item from the cart
router.post('/remove-from-cart/:productId', ensureAuthenticated, async (req, res) => {
    const productId = req.params.productId;

    try {
        const user = await User.findById(req.session.userId);
        // Remove the item from the cart array
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error("Error in /remove-from-cart route:", err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/cart-data', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('cart.product');
        let subtotal = user.cart.reduce((acc, item) => acc + item.product.Cost * item.quantity, 0);
        let tax = subtotal * 0.13;
        let total = subtotal + tax;
        res.json({ subtotal, tax, total, cart: user.cart });
    } catch (err) {
        console.error("Error in /cart-data route:", err);
        res.status(500).send('Internal Server Error');
    }
});



// POST route to clear the cart
router.post('/clear-cart', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        user.cart = []; // Clear the cart array
        await user.save();
        res.status(200).send('Cart cleared');
    } catch (err) {
        console.error("Error in /clear-cart route:", err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/confirm-checkout', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        // Assuming the orders field in User schema is an array of OrderSchema
        user.orders.push({ products: user.cart, /* other order fields */ });
        user.cart = [];
        await user.save();
        res.json({ message: 'The order has successfully placed.' });
    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
