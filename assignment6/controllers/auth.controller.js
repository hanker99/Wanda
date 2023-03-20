const AuthService = require("../services/AuthService");
const CredentialService = require("../services/CredentialService");
const CartService = require("../services/CartService");
const MealkitService = require("../services/MealkitService");
const authValidation = require('../helpers/validations/auth')

module.exports = class Auth {
  static async apiRegister(req, res, next) {
    try {
      const register = await AuthService.register(req.body);
      if (!register) {
        res.status(404).json("registration failed!")
      }
      res.json(register);
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  static async apiLogin(req, res, next) {
    const errors = authValidation.validationLogin(req);

    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }

    let user = await AuthService.isAuthenticated(req.body, req)
    if (!user) {
      let errorData = {
        email: 'invalid email or password.'
      }
      return res.status(400).json({
        success: false,
        message: 'invalid email or password.',
        errors: errorData
      });
    }
    let redirect;
    if (req.body.role == 1) {
      redirect = '/clerk-dashboard';
    } else if (req.body.role == 2) {
      redirect = '/customer-dashboard';
    }

    let data = {
      user: user,
      redirect: redirect
    }
    res.status(200).json({
      success: true,
      data: data,
      message: 'Login successful',
    })
  }

  static async apiSignup(req, res, next) {
    const errors = authValidation.validationSignup(req);

    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }

    let temp = await AuthService.isUserExist(req.body)
    if (temp) {

      let errorsData = {
        email: 'This email User already exists'
      }
      return res.status(400).json({
        success: false,
        errors: errorsData,
        message: 'Signup failed please enter valid data.'
      });
    }
    const register = await AuthService.register(req.body);
    if (register !== null) {
      res.status(200).json({
        success: true,
        message: 'Signup successful',
      })
    } else {
      res.status(200).json({
        success: false,
        errors: {},
        message: 'Signup failed',
      })
    }


    let sendGridCredentials = await CredentialService.getCredentials('sendgrid')

    console.log('sendGridCredentials', sendGridCredentials.value)
    if (sendGridCredentials !== undefined && sendGridCredentials.value !== undefined) {
      //let sendGridKey = process.env.SENDGRID_API_KEY
      let sendGridKey = sendGridCredentials.value
      //console.log('process.env.SENDGRID_API_KEY', process.env.SENDGRID_API_KEY)

      // sgMail.setApiKey(sendGridKey)
      // const msg = {
      //   to: req.body.email, // Change to your recipient
      //   from: 'yqliu3@myseneca.ca', // Change to your verified sender
      //   subject: 'Welcome to food circle',
      //   text: 'Welcome to food circle',
      //   html: `<div>
      //   <div>Hello, ${req.body.firstName} ${req.body.lastName}</div>
      //   <div>Welcome to food circle</div>
      //   <div>yqliu</div>
      //   <div>Regards</div>
      //   <div>Food Circle</div>
      //   </div>`,
      // }

      // console.log('msg', msg)
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     console.log('Email sent')
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })
    }

  }
  static async apiCartDetails(req, res, next) {
    try {
      const session = req.session;
      if (session.userid == undefined) {
        res.render('login');
      }
      const cartItems = await CartService.getCartItemsWithDetails(session.userid);
      if (!cartItems) {
        res.status(404).json("Cart not found")
      }

      let totalPrice = 0;

      for (let item of cartItems) {
        let itemPrice = item.items.quantity * parseFloat(item.details.price.replace('$', ''));
        totalPrice += itemPrice;
        item.items.total = itemPrice;
      }

      totalPrice = parseFloat(totalPrice).toFixed(2)

      console.log('cartItems 22', cartItems)

      res.render('cartDetail', { layout: 'main', listExists: true, isLoggedIn: session.firstName != undefined, firstName: session.firstName, role: session.role == '1' ? true : false, totalPrice: totalPrice, itemsCount: cartItems.length, cartItems: cartItems });

    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  static async apiOrderPlace(req, res, next) {
    try {
      const session = req.session;

      if (session.userid == undefined) {
        res.status(200).json({
          success: true,
          message: 'Login required',
          data: { redirect: '/login' }
        })
      }

      let sendGridCredentials = await CredentialService.getCredentials('sendgrid')

      const cartItems = await CartService.getCartItemsWithDetails(req.session.userid)
      let totalPrice = 0;
      for (let item of cartItems) {
        let itemPrice = item.items.quantity * parseFloat(item.details.price.replace('$', ''));
        totalPrice += itemPrice;
      }

      totalPrice = parseFloat(totalPrice).toFixed(2)

      console.log('sendGridCredentials', sendGridCredentials.value)
      if (sendGridCredentials !== undefined && sendGridCredentials.value !== undefined) {
        //let sendGridKey = process.env.SENDGRID_API_KEY
        let sendGridKey = sendGridCredentials.value
        //console.log('process.env.SENDGRID_API_KEY', process.env.SENDGRID_API_KEY)

        // sgMail.setApiKey(sendGridKey)
        // const msg = {
        //   to: req.body.email, // Change to your recipient
        //   from: 'yqliu3@myseneca.ca', // Change to your verified sender
        //   subject: 'Welcome to food circle',
        //   text: 'Welcome to food circle',
        //   html: `<div>
        //   <div>Hello, ${session.firstName}</div>
        //    <div>Your Order placed successfully </div>
        //   <div>Total price ${totalPrice}</div>
        //   <div>yqliu</div>
        //   <div>Regards</div>
        //   <div>Food Circle</div>
        //   </div>`,
        // }

        // console.log('msg', msg)
        // sgMail
        //   .send(msg)
        //   .then(() => {
        //     console.log('Email sent')
        //   })
        //   .catch((error) => {
        //     console.error(error)
        //   })
      }

      await CartService.deleteCart(req.session.userid)

      res.status(200).json({
        success: true,
        message: 'Order placed successful',
        data: { redirect: '/cart-details' }
      })

    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  static async apiDeleteToCart(req, res, next) {
    try {
      const session = req.session;

      if (session.userid == undefined) {
        res.status(200).json({
          success: true,
          message: 'Login required',
          data: { redirect: '/login' }
        })
      }
      const cart = await CartService.deleteItemById(req.params.cartId, req.params.id)
      res.status(200).json({
        success: true,
        message: 'Delete item to cart successful',
        data: { redirect: '/cart-details' }
      })
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  static async apiUpdateToCart(req, res, next) {
    try {
      const session = req.session;

      if (session.userid == undefined) {
        res.status(200).json({
          success: true,
          message: 'Login required',
          data: { redirect: '/login' }
        })
      }
      const cart = await CartService.updateCartItem(req.body)
      res.status(200).json({
        success: true,
        message: 'Update item to cart successful',
        data: { redirect: '/cart-details' }
      })
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }
  static async apiAddToCart(req, res, next) {
    try {

      const session = req.session;

      if (session.userid == undefined) {
        res.status(200).json({
          success: true,
          message: 'Login required',
          data: { redirect: '/login' }
        })
      }
      const cart = await CartService.isCartExists(session.userid)
      const mealKit = await MealkitService.getMealkitById({ _id: req.body.id });
      if (!cart && mealKit) {
        let data = [{ item_id: mealKit._id, quantity: 1, price: mealKit.price }];
        await CartService.createCart({ user_id: session.userid, items: data, status: false });
      } else {
        let isItemExists = await CartService.isItemExistInCart(cart._id, mealKit._id);
        if (!isItemExists) {
          let dataItem = { item_id: mealKit._id, quantity: 1, price: mealKit.price };
          await CartService.addToCartItems(cart._id, dataItem);
        }
      }
      res.status(200).json({
        success: true,
        message: 'Add to cart successful',
        data: { redirect: '/cart-details' }
      })
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }
}