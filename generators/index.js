/*
* Informations from front-end
* params:
*    url:                     $('#conector').val(),
*    conector:                $('#conector').val(), 
*    conector_id:             $('#conector').find(":selected").attr('id'), 
*    entrada:                 $('#entrada').val(), 
*    saida:                   $('#saida').val(),
*    book_entrada:            $('#book_entrada').val(), 
*    book_saida:              $('#book_saida').val(),
*    'split-info-entrada':    $('#split-info-entrada').val(),
*    'split-info-saida':      $('#split-info-saida').val(),
*    'split-line-entrada':    $('#split-line-entrada').val(),
*    'split-line-saida':      $('#split-line-saida').val()
*/
"use strict";
var _ = require('underscore');
var moment = require('moment');
var S = require("underscore.string");
var stringify_object = require('stringify-object');
var jju = require('jju')

module.exports = function(params){
    var result = {
        data_atual: moment().format('DD-MM-YYYY HH:mm'),
        conector_model: 'aaaaaa',
        conector_service: 'aaaaaa',
        book_entrada: mount_book(params.book_entrada, params['split-info-entrada'], params['split-line-entrada']),
        book_saida: mount_book(params.book_saida, params['split-info-saida'], params['split-line-saida']),
        transacao: json_parse(params.entrada).transacao,
        service_file: 'aaaaaa',
        name_service: 'uyyyyyyyyyyyy',
        conector: 'uyyyyyyyyyyyy',
        trancode_envio: 'uyyyyyyyyyyyy',
        trancode_resposta: 'uyyyyyyyyyyyy'
    };
    result.book_entrada_html = stringify_object(result.book_entrada);
    result.book_saida_html = stringify_object(result.book_saida);
    return _.extend(params, result);
}

function json_parse(entrada){
    return jju.parse(entrada);
}
function mount_book(book, split_info, split_line){
    var map ={
        '\\n': '\n',
    };
    var arr_book = book.split(map[split_line] || split_line);
    arr_book = arr_book.map(function(i){
        return i.split(split_info);
    });
    // formando object do service
    arr_book = arr_book.map(function(item){
        var nome = (!!item[1]) ? item[1] : attr(item[0]);
        var result = { nome: nome, tipo:'texto', tamanho: item[2], fixo: item[3], descricao:item[0] }
        if (!result.fixo) delete result.fixo;
        return result
    });
    return arr_book;
}

function attr(name){
    return S.replaceAll(name.toLowerCase(), '-', '_');
}
