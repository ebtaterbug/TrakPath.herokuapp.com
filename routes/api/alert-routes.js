const router = require('express').Router();
const { User, Tempalert } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Tempalert.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id', 
      'device',
      'number',
      'maxtemp',
      'mintemp',
      'messaged'
    ],
    order: [['id', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['username', 'id']
      }
    ]
  })
    .then(data => res.json(data))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Tempalert.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id', 
      'device',
      'number',
      'maxtemp',
      'mintemp'
    ],
    include: [
      {
        model: User,
        attributes: ['username', 'id']
      }
    ]
  })
    .then(data => {
      if (!data) {
        res.status(404).json({ message: `No devices found with id ${req.params.id}` });
        return;
      }
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  Tempalert.create({
    device: req.body.device,
    number: req.body.number,
    maxtemp: req.body.maxtemp,
    mintemp: req.body.mintemp,
    user_id: req.session.user_id
  })
    .then(data => res.json(data))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  Tempalert.update(
    {
        device: req.body.device,
        number: req.body.number,
        maxtemp: req.body.maxtemp,
        mintemp: req.body.mintemp,
        messaged: req.body.messaged
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(data => {
      if (!data) {
        res.status(404).json({ message: `No posts found with id ${req.params.id}` });
        return;
      }
      res.json({ message: `Post ${req.params.id} updated`});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Tempalert.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(data => {
      if (!data) {
        res.status(404).json({ message: `No device found with id ${req.params.id}` });
        return;
      }
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;