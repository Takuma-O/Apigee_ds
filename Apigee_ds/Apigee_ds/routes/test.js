'use strict';
var express = require('express');
var router = express.Router();
var { Client } = require('pg');


/* GET users listing. */
router.get('/:document_id', function (req, res) {
    var id = req.params.document_id;

    var client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'docusign_test',
        password: 'root',
        port: 5432
    });

    client.connect();

    client.query('SET search_path = docusign_test', (err, result) => {
        if (err) {
            res.json({
                message: 'SET search_path Error.'
            });
        }
    });

    const select = {
        text: 'SELECT * FROM docusign_document WHERE ds_document_id = $1',
        values: [id]
    };

    client.query(select, (err, result) => {
        if (err) {
            res.json({
                message: 'Select Error.'
            });
        } else {
            res.json({
                ds_document_id: result.rows[0].ds_document_id,
                ds_document_name: result.rows[0].ds_document_name,
                ds_status: result.rows[0].ds_status
            });
        }
    });



});
    module.exports = router;