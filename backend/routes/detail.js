const express = require('express');
const multer = require('multer');

const Detail = require('../models/detail');
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

router.post('', checkAuth, multer({ storage: storage }).fields([{name: 'logo', maxCount: 1},{name: 'plat', maxCount: 1},{name: 'svg', maxCount: 1}]), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const detail = new Detail({
    name: req.body.name,
    logoPath: url + '/images/' + req.file.filename,
    location: req.body.location,
    build: req.body.build,
    startingPrice: req.body.startingPrice,
    lots: req.body.lots,
    details: req.body.details,
    platPath: url + '/images/' + req.file.filename,
    svgPath: url + '/images/' + req.file.filename,
    svgStyle: req.body.svgStyle,
    map: req.body.map
  });
  detail.save().then(createdDetail => {
    res.status(201).json({
      message: 'Detail added successfully!',
      detail: {
        ...createdDetail,
        _id: createdDetail._id,
      }
    });
  });
});

router.put('/:_id', multer({ storage: storage }).fields([{name: 'logo', maxCount: 1},{name: 'plat', maxCount: 1},{name: 'svg', maxCount: 1}]), (req, res, next) => {
  let logoPath = req.body.logoPath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    logoPath = url + '/images/' + req.file.filename;
    platPath = url + '/images/' + req.file.filename;
    svgPath = url + '/images/' + req.file.filename;
  }
  const detail = new Detail ({
    _id: req.body._id,
    name: req.body.name,
    logoPath: logoPath,
    location: req.body.location,
    build: req.body.build,
    startingPrice: req.body.startingPrice,
    lots: req.body.lots,
    details: req.body.details,
    platPath: platPath,
    svgPath: svgPath,
    svgStyle: req.body.svgStyle,
    map: req.body.map
  });
  Detail.updateOne({_id: req.params._id}, detail).then(result => {
    res.status(200).json({message: 'Update successful!'});
  });
});

router.get('/:_id', (req, res, next) => {
  Detail.findById(req.params._id).then(detail => {
    if(detail) {
      res.status(200).json(detail);
    } else {
      res.status(404).json({message: 'Detail not found!'});
    }
  });
});

module.exports = router;
