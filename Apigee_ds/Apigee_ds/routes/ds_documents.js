'use strict';
var express = require('express');
var router = express.Router();
var { Client } = require('pg');

/* GET docuign document. */
router.get('/:document_id', function (req, res) {
    var id = req.params.ds_document_id;

    var client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'docusign_test',
        password: 'root',
        port: 5432
    });

    client.connect();
    client.query("SET search_path TO 'docusign_test';");

    if (req.query.fields) {
        var fields = req.query.fields.split(',');
        fields.forEach(function (field, i) {
            switch (field) {
                case 'ds_envelope_id':
                    break;
                case 'process_status':
                    break;
                case 'contract_end_date':
                    break;
                case 'registration_date':
                    break;
                default:
                    res.json({
                        status_code: '400',
                        message: 'Invalid parameter.'
                    })
            }
        });
    }

    const select = {
        text: 'SELECT * FROM docusign_document WHERE ds_document_id = $1',
        values: [id]
    };

    client.query(select, (err, result) => {
        if (err) {
            res.json({
                status_code: '404',
                message: 'Not Found.'
            });
        } else {
            const json = {
                ds_document_id: result.rows[0].ds_document_id,
                ds_document_name: result.rows[0].ds_document_name,
                ds_status: result.rows[0].ds_status
            };
            if (fields) {
                fields.forEach(function (field, i) {
                    switch (field) {
                        case 'ds_envelope_id':
                            json.push({ ds_envelope_id: result.rows[0].ds_envelope_id });
                            break;
                        case 'process_status':
                            json.push({ process_status: result.rows[0].process_status });
                            break;
                        case 'contract_end_date':
                            json.push({ contract_end_date: result.rows[0].contract_end_date });
                            break;
                        case 'registration_date':
                            json.push({ registration_date: result.rows[0].registration_date });
                            break;
                    };
                });
            };
            res.json(json);
        }
    }
})

module.exports = router;
