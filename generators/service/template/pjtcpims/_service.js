/**
 * @author   Alther <agimenes@br.ibm.com>
 * @since    <%=data_atual%>
 * @summary  Service para transacao : <%= transacao %>
 */
 "use strict";
var itau = require("itau-api-core");
var model = itau.connector.pjtcpims.model;
var service = itau.connector.pjtcpims.service.create();

var transacaoBase = {
	campos: <%=book_entrada_html%>
};

var transacaoEnvio = {
  resposta: <%= book_saida_html%>,
  parametros: {
    transacao: "<%= transacao %>"
  }
};
module.exports = model.create("Service<%=transacao.trim()%>", service, transacaoBase, transacaoEnvio);