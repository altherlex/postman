var express = require('express');
var router = express.Router();
var config_pattern = require('./config-pattern.json');
var stringify_object = require('stringify-object');
var jju = require('jju')
var ejs = require('ejs');
var request = require('../lib/request');
var book = require('../lib/book');
var fs = require('fs');
var path = require('path');
var async = require('async');

//appling stringify_object
config_pattern.connectores.forEach(function(item){
    item.config_stringify =  stringify_object(item.config, {indent: '  ', singleQuotes: false});
});

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Postman for Itau-Unibanco', configs: config_pattern});
});

router.post('/request', function(req, res, next) {
    var entrada = jju.parse(req.body.entrada);
    request.post(req.body.url, entrada, function(err, result){
        if (err)
            next(err);
        else
            res.json({json:result.req.body, text:stringify_object(result.req.body, {indent: '  ', singleQuotes: false}) });
    });
});

router.post('/scaffold/:template', function(req, res, next) {
    // ejs.render("<h1><%= title %></h1>", {title:'yeah ejs'});
    var op = {
        conector_model: 'aaaaaa',
        conector_service: 'aaaaaa',
        formatter_transacao_base: 'aaaaaa',
        transacao: 'aaaaaa',
        service_file: 'aaaaaa',
        name_service: 'uyyyyyyyyyyyy',
        conector: 'uyyyyyyyyyyyy',
        trancode_envio: 'uyyyyyyyyyyyy',
        trancode_resposta: 'uyyyyyyyyyyyy'
    };


    var template = path.join(__dirname, '..', 'generators', req.params.template, 'template', '_service.js');
    var template_test = path.join(__dirname, '..', 'generators', req.params.template, 'template', '_service.tests.js');

    if (fs.existsSync(template) && fs.existsSync(template_test))
        async.waterfall([
            function (callback){
                ejs.renderFile(template, op, function(err, result){
                    callback(null, {html:result});
                });
            },
            function (obj, callback){
                ejs.renderFile(template_test, op, function(err, result){
                    obj.html_test = result;
                    callback(null, obj);
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
        next("Template file doesn't exist: "+template);
});

module.exports = router;
