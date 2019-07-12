const express = require('express');
const multer = require('multer');

const Development = require('../models/development');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', checkAuth, multer({ storage: storage }).single("logo"), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const development = new Development({
    name: req.body.name,
    logoPath: url + '/images/' + req.file.filename,
    location: req.body.location,
    build: req.body.build,
    startingPrice: req.body.startingPrice,
    lots: req.body.lots
  });
  development.save().then(createdDev => {
    res.status(201).json({
      message: 'Development added successfully!',
      development: {
        ...createdDev,
        _id: createdDev._id,
      }
    });
  });
});

router.put('/:_id', checkAuth, multer({ storage: storage }).single("logo"), (req, res, next) => {
  let logoPath = req.body.logoPath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    logoPath = url + '/images/' + req.file.filename;
  }
  const development = new Development ({
    _id: req.body._id,
    name: req.body.name,
    logoPath: logoPath,
    location: req.body.location,
    build: req.body.build,
    startingPrice: req.body.startingPrice,
    lots: req.body.lots
  });
  Development.updateOne({_id: req.params._id}, development).then(result => {
    res.status(200).json({message: 'Update successful!'});
  });
});

router.get('', (req, res, next) => {
  Development.find()
    .then(documents => {
      res.status(200).json({
        message: 'Developments fetched successfully!',
        developments: documents
      });;
    });
});

router.get('/:_id', (req, res, next) => {
  Development.findById(req.params._id).then(development => {
    if(development) {
      res.status(200).json(development);
    } else {
      res.status(404).json({message: 'Development not found!'});
    }
  });
});

router.delete('/:_id', checkAuth, (req, res, next) => {
  Development.deleteOne({_id: req.params._id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Development deleted!'});
  });
});

module.exports = router;
