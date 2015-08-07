var express = require('express');
var router = express.Router();
var config_pattern = require('../lib/config-pattern.json');
var stringify_object = require('stringify-object');
var jju = require('jju')
var ejs = require('ejs');
var request = require('request');
var book = require('../lib/book');
var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('underscore');
var generator_op = require('../generators/index');

//appling stringify_object
config_pattern.connectores.forEach(function(item){
    item.config_stringify =  stringify_object(item.entrada, {indent: '  ', singleQuotes: false});
});

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Postman for Itau-Unibanco', configs: config_pattern});
});

router.post('/request', function(req, res, next) {
    var entrada = jju.parse(req.body.entrada);
    request.post(req.body.url, {json: entrada}, function(err, response, body){
        if (err)
            next(err);
        else
            res.json({statusCode: response.statusCode, json:body, text:stringify_object(body, {indent: '  ', singleQuotes: false}) });
    });
});

router.post('/scaffold/:template', function (req, res, next){
    var op = generator_op( _.extend(req.params, req.body) );
    var template = path.join(__dirname, '..', 'generators', req.params.template, 'template', req.body.conector_id, '_service.js');
    var template_test = path.join(__dirname, '..', 'generators', req.params.template, 'template', req.body.conector_id, '_service.tests.js');

    if (fs.existsSync(template) && fs.existsSync(template_test))
        async.waterfall([
            function (callback){
                ejs.renderFile(template, op, function(err, result){
                    if (err)
                        next();
                    else
                        callback(null, {html:result});
                });
            },
            function (obj, callback){
                ejs.renderFile(template_test, op, function(err, result){
                    if (err){
                        next();
                    }else{
                        obj.html_test = result;
                        callback(null, obj);
                    }
                });
            }
        ],
        function (erro, result){
            if (erro)
                next(erro);
            else
                res.json(result);
        });        
    else
        next();
});

module.exports = router;
