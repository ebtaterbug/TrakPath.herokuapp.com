const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Device } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
  Device.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id', 
      'name', 
      'device'
    ],
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['username', 'id']
      }
    ]
  })
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('devices', { 
            posts,
            loggedIn: req.session.loggedIn,
            username: req.session.username
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/sign-up', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('sign-up');
});

router.get('/map', (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
    return;
  }

  Device.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id', 
      'name', 
      'device'
    ],
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['username', 'id']
      }
    ]
  })
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('map', { 
            posts,
            loggedIn: req.session.loggedIn,
            username: req.session.username
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/reports', (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
    return;
  }

  Device.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id', 
      'name', 
      'device'
    ],
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['username', 'id']
      }
    ]
  })
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('reports', { 
            posts,
            loggedIn: req.session.loggedIn,
            username: req.session.username
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/add-device', (req, res) => {
    res.render('add-device', { 
      loggedIn: req.session.loggedIn,
      username: req.session.username
  });
  
});

module.exports = router;