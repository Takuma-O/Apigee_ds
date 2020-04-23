'use strict';
var express = require('express');
var router = express.Router();

var { Client } = require('pg');

const log4js = require('log4js')

log4js.configure({
    appenders: {
        system: { type: 'file', filename: 'system.log' }
    },
    categories: {
        default: { appenders: ['system'], level: 'debug' },
    }
});
const logger = log4js.getLogger('system');

/* GET docuign document. */
router.get('/:document_id', function (req, res) {

    var id = req.params.document_id;
    logger.debug('ds_document_id:' + id);

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
                        message: 'invalid parameter.'
                    })
            }
        });
    }

    var select = {
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
                            json.ds_envelope_id = result.rows[0].ds_envelope_id;
                            break;
                        case 'process_status':
                            json.process_status = result.rows[0].process_status;
                            break;
                        case 'contract_end_date':
                            json.contract_end_date = result.rows[0].contract_end_date;
                            break;
                        case 'registration_date':
                            json.registration_date = result.rows[0].registration_date;
                            break;
                    };
                });
            };
            res.json(json);
        }
    });
});

module.exports = router;
