const router = require('express-promise-router')()
const rateLimit = require('express-rate-limit')
const { celebrate, Joi, Segments } = require('celebrate')
const User = require('../models/user')
const Order = require('../models/order')
const Notification = require('../models/notification')
const Message = require('../models/message')
const { ensureAuth } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const {sendPushNotification} = require('../utils/expo')

router.get(
  '/',
  ensureAuth,
  async (req, res) => {
    res.json(req.user)
  })

const updateProfileValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    profile: Joi.object().keys({
      name: Joi.string().min(3).max(60).trim(),
      email: Joi.string().email()
    })
  })
})

router.get(
  '/orders',
  ensureAuth,
  async (req, res) => {
    const orders = await Order.find({user: req.user})
    res.json(orders)
})

router.put(
  '/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureAuth,
  updateProfileValidator,
  async (req, res) => {
    await User.updateOne({email: req.user.email}, req.body.profile)
    res.sendStatus(200)
})

const changePasswordValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
  })
})

router.patch(
  '/change-password',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    // limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureAuth,
  changePasswordValidator,
  async (req, res) => {
    const user = req.user;
    try {
      console.log("[asdsadasx", req.body)
      await user.changePassword(req.body.oldPassword, req.body.newPassword);
      // await user.save();
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(401).json({ error: 'Şifre değişikliği başarısız.' });
    }
  })

router.patch(
  '/upload/avatar/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureAuth,
  upload.single('avatar'),
  async (req, res) => {
    const user = await User.findById(req.user._id)
    await user.changeAvatar(req.file.filename)

    res.sendStatus(200)
  })

router.delete(
  '/',
  ensureAuth,
  async (req, res, next) => {
    await req.user.delete()

    req.logout((err) => {
      if (err) { return next(err) }
      res.sendStatus(200)
    })
    res.sendStatus(200)
  })


const notificationValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
      token: Joi.string().required()
    })
  })

router.get(
    '/notifications',
    ensureAuth,
    async (req, res) => {
      res.json(await Notification.find({ receiver: req.user }))
    })
  

    router.get(
      '/contacts',
      ensureAuth,
      async (req, res) => {
        const filter = {};
    
        if (req.query.name) {
          filter.name = new RegExp(req.query.name, 'i');
        }
    
        // Admin kullanıcılarını getir
        const admins = await User.find({ role: 'USER', ...filter });
    
        // Her adminin en son mesajını bul
        const adminsWithLastMessage = await Promise.all(admins.map(async (admin) => {
          const lastMessage = await Message.findOne({
            $or: [
              { sender: admin },
              { receiver: admin }
            ]
          }).sort({ timestamp: -1 });
    
          return {
            ...admin.toObject(),
            lastMessage: lastMessage ? lastMessage.text : null,
            isReaded: lastMessage ? lastMessage.read : 'NO'
          };
        }));
    
        // Sıralama: önce isReaded false, sonra true, en sonda 'NO'
        const sortedAdmins = adminsWithLastMessage.sort((a, b) => {
          const order = {
            false: 1,
            true: 2,
            'NO': 3
          };
          return (order[a.isReaded] || 3) - (order[b.isReaded] || 3);
        });
    
        res.json(sortedAdmins);
      }
    );
    
    



router.post(
  '/notifications',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureAuth,
  notificationValidation,
  async (req, res) => {
    const { token } = req.body

    try {
      await req.user.updateExpoToken(token)
      res.sendStatus(200)
    } catch(err) {
      res.sendStatus(400)
    }
  }
)

router.get(
  '/support',
  ensureAuth,
  async (req, res) => {
    const filter = {};

    if (req.query.name) {
      filter.name = new RegExp(req.query.name, 'i');
    }

    // Admin kullanıcılarını getir
    const admins = await User.find({ role: 'ADMIN', ...filter });

    // Her adminin en son mesajını bul
    const adminsWithLastMessage = await Promise.all(admins.map(async (admin) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: admin },
          { receiver: admin }
        ]
      }).sort({ createdAt: -1 });

      return {
        ...admin.toObject(),
        lastMessage: lastMessage ? lastMessage.text : null,
        isReaded: lastMessage ? lastMessage.read : false
      };
    }))

    res.json(adminsWithLastMessage);
  }
);

module.exports = router
