var request = require('request');
var async = require('async');
var xml2js = require('xml2js');
var S = require("underscore.string");
var _ = require('underscore');
var parserXml = new xml2js.Parser({
  mergeAttrs: true,
  explicitArray: false
});

var fn_try = function(url, entrada, callback){
    request.post(url, {json: entrada},
        function (error, res, body) {
            if (!error && res.statusCode === 200){
                callback(null, body);
            }else{
                callback(error, res);
            }
        }
    );
}
module.exports.post = function(url, entrada, callback){
    async.waterfall([
            function (callback){
                fn_try(url, entrada, callback);
            },
            function (trancode_res, callback){
                callback(null, trancode_res);
            //     trancode_res = fn_split_trancode(trancode_res, 'MENS');
            //     parserXml.parseString(trancode_res, function (err,result){
            //         callback(null, result);
            //     });                
            }
        ],
        function (erro, result){
            // TODO:
            //#1 CRIAR arquivo factory-girl.json com o json da mensagem (para válido e inválido)
            // ALINHANDO OBJECT
            // return {book_res: fn_criar_book(result['MENS']['DADOS-DE-NEGOCIO']), factory: result };
            result = {req: {body: result }};
            if (erro)
                callback(erro, result);
            else
                callback(null, result);
        }
    );
}

function define_name(name){
    return S.replaceAll(name.toLowerCase(), '-', '_');
}
var fn_criar_book = function(json){
    var book = [];
    Object.keys(json).forEach(function(tag_name){
        if ( S.startsWith(tag_name,'LISTA') ){
            book.push( {tag:tag_name, nome:define_name(tag_name)} );

            var next_tag = S.replaceAll(tag_name, 'LISTA-', '');
            book.push( {tag:next_tag, nome:define_name(next_tag)} );

            var list_or_object = json[tag_name][next_tag];
            if (sub_book){
                var list = [].concat.apply(list_or_object);
                var sub_book = list[0];

                Object.keys(sub_book).forEach(function(key){
                    book.push( {tag:key, nome:define_name(key), valor:sub_book[key]} );
                });
            }
        }else{
            book.push( {tag:tag_name, nome:define_name(tag_name), valor:json[tag_name]} );
        }
    });
    console.log("Finalized compose book:");
    console.log( book );
    return book
}
var fn_split_trancode = function(trancode_entrada, tag){
    var index_ini = trancode_entrada.indexOf('<'+tag+'>');
    var index_fim = trancode_entrada.indexOf('</'+tag+'>');
    return trancode_entrada.slice( index_ini, index_fim+tag.length+3);
}