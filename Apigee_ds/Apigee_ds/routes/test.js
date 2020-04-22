'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    if (req.query.fields) {
        const fields = req.query.fields.split(',');
        fields.forEach(function (field, i) {
            switch (field) {
                case 'aaa':
                    res.json({
                        status_code: '200',
                        message: 'OK'
                    })
                default:
                    res.json({
                        status_code: '400',
                        message: 'Invalid parameter.' })
            }
        });

    } else {
        res.json({
            status_code: '200',
            message:'OK'
        })
    }
});
    module.exports = router;