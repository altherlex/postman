var expect = require("expect.js");
var service;
var expect_data;

describe("SERVICE: <%=name_service%>, conector <%=conector%> e transacao <%=transacao%>.", function() {
	before(function() {
		require("../loadItau") (this, function() {
			service = require("../../service/<%=service_file%>.js")();
		});
	});
	describe("Testar o trancode de envio.", function(done) {
		it("Caso de teste de envio de trancode.", function(done) {
			// var dados = { 
			// 	'tagCCANADTBC':"71",
			// 	id_contrato_limite_unico: "00063813681", 
			// 	valor_simulacao:'1500',
			// 	'tagBENCR':'00',
			// 	'tagCFUNLUSUA': ''
			// };
			var trancodeEsperado = '<%=trancode_envio%>';
			service.executa(dados);
			var trancodeGerado = service._trancode; 
			expect(trancodeGerado).to.be.equal(trancodeEsperado);
			done();
		});	
	});
	describe("Testar o trancode de resposta.", function(done) {
		beforeEach(function(){
			expect_data = {
				areaControle: {
				     'AREA-ORQO': { 'COD-SERV-ORQO': 'AE50002X' },
				     'AREA-STAT':
				      { 'NUM-CHAV-EMIS': 'KFIHOCDDHBHGEJNMHEHALFMIIQH',
				        'NUM-CHAV-PROC': 'ER1 0100128240000003         0',
				        'IND-STAT-PROC': 'P',
				        'COD-SIST-MENS': 'QT',
				        'COD-MENS': '00001',
				        'DES-MENS': 'PROCESSAMENTO EFETUADO',
				        'DES-MENS-REDU': '',
				        'IND-CTNA': 'FQ' }
				},
				dadosNegocio: {
					idContratoLimiteUnico: '',
					tagVLIMISLTD: '',
					tagBENCR: '',
					tagQOCORLIST: '',
					listaLimites: { 
						LIST: [
							{ SPROD: '00',
							  NPRIOITEMSIMU: '00',
							  XJURO: '00',
							  VLIMICNTR: '00',
							  VLIMIUTZD: '00',
							  VLIMISGRDREDU: '00',
							  VLIMIMINMREDU: '00',
							  VLIMIMAXIREDU: '00' }
						]
					}
				}
			};
		});		
		it("Caso de testes de conversão do trancode de resposta com um único limite na lista.", function(done) {
			var resposta = '<%=trancode_resposta%>';
			service.parse(resposta);
			var retornoServico = service._parsedOutput;

			expect(retornoServico.dadosNegocio.listaLimites['LIST']).to.be.an(Object);
			expect_data.dadosNegocio.listaLimites.LIST = expect_data.dadosNegocio.listaLimites.LIST[0];
			expect(retornoServico).to.eql(expect_data);
			done();
		});
		it("Caso de testes de conversão do trancode de resposta com vários limites na lista.", function(done) {
			var resposta = "            <?xml version='1.0'?> <MENS> <AREA-CTRL> <AREA-ORQO> <COD-SERV-ORQO>AE50002X</COD-SERV-ORQO> </AREA-ORQO> <AREA-STAT> <NUM-CHAV-EMIS>KFIHOCDDHBHGEJNMHEHALFMIIQH</NUM-CHAV-EMIS> <NUM-CHAV-PROC>ER1 0100128240000003         0</NUM-CHAV-PROC> <IND-STAT-PROC>P</IND-STAT-PROC> <COD-SIST-MENS>QT</COD-SIST-MENS> <COD-MENS>00001</COD-MENS> <DES-MENS>PROCESSAMENTO EFETUADO</DES-MENS> <DES-MENS-REDU></DES-MENS-REDU> <IND-CTNA>FQ</IND-CTNA> </AREA-STAT> </AREA-CTRL> <AREA-SEGC></AREA-SEGC> <DADOS-DE-NEGOCIO> <NSIMU></NSIMU> <VLIMISLTD></VLIMISLTD> <BENCR></BENCR> <QOCORLIST></QOCORLIST> <LISTA-LIST> <LIST> <SPROD>00</SPROD> <NPRIOITEMSIMU>00</NPRIOITEMSIMU> <XJURO>00</XJURO> <VLIMICNTR>00</VLIMICNTR> <VLIMIUTZD>00</VLIMIUTZD> <VLIMISGRDREDU>00</VLIMISGRDREDU> <VLIMIMINMREDU>00</VLIMIMINMREDU> <VLIMIMAXIREDU>00</VLIMIMAXIREDU> </LIST> <LIST> <SPROD>01</SPROD> <NPRIOITEMSIMU>01</NPRIOITEMSIMU> <XJURO>01</XJURO> <VLIMICNTR>01</VLIMICNTR> <VLIMIUTZD>01</VLIMIUTZD> <VLIMISGRDREDU>01</VLIMISGRDREDU> <VLIMIMINMREDU>01</VLIMIMINMREDU> <VLIMIMAXIREDU>01</VLIMIMAXIREDU> </LIST> </LISTA-LIST> </DADOS-DE-NEGOCIO> </MENS>";
			service.parse(resposta);
			var retornoServico = service._parsedOutput;
			expect_data.dadosNegocio.listaLimites.LIST.push({ 
						SPROD: '01',
						NPRIOITEMSIMU: '01',
						XJURO: '01',
						VLIMICNTR: '01',
						VLIMIUTZD: '01',
						VLIMISGRDREDU: '01',
						VLIMIMINMREDU: '01',
						VLIMIMAXIREDU: '01'
			});
			expect(retornoServico.dadosNegocio.listaLimites['LIST']).to.be.an(Array)
			expect(retornoServico.dadosNegocio.listaLimites.LIST).to.eql(expect_data.dadosNegocio.listaLimites.LIST);
			expect(retornoServico).to.eql(expect_data);
			done();
		});
	});
});