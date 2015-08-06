/**
 * @author   Alther <agimenes@br.ibm.com>
 * @since    <%=Date()%>
 * @summary  Service para transacao : <%= transacao %>
 */
 "use strict";
var itau = require("itau-api-core");
var model = itau.connector.<%=conector_service%>.<%=conector_model%>;
var service = itau.connector.<%=conector_service%>.service.create();

var transacaoBase = {
	campos: <%=formatter_transacao_base%>
};

var transacaoOpcoes = {
    resposta: [
      // {tag: 'NSIMU', nome:'idContratoLimiteUnico'},
    ],
    parametros: {
      servicoQt: '<%= transacao %>',
  		codigoCanal: '71',
  		idioma: 'PT-BR',
  		modoOperacao: '00',
    },
    blindagem: {},
    dados: [],
    cache: {}
};
module.exports = model.create("<%=service_file%>", service, transacaoBase, transacaoOpcoes);