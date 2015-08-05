var express = require('express');
var router = express.Router();
var config_pattern = require('./config-pattern.json');
var stringify_object = require('stringify-object');
var jju = require('jju')

//appling stringify_object
config_pattern.connectores.forEach(function(item){
    item.config_stringify =  stringify_object(item.config, {indent: '  ', singleQuotes: false});
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Postman for Itau-Unibanco', configs: config_pattern});
});

router.post('/request', function(req, res, next) {
    var result = jju.parse(req.body.entrada);
    res.json({json:result, text:stringify_object(result, {indent: '  ', singleQuotes: false}) });
});

module.exports = router;
