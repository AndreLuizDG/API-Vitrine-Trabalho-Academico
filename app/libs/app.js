$(document).ready(function(){});
                  
                  
function buscarDados(url, dados, executar) {
    escreverLoadAction();
    $.ajax({
        type: "POST",
        url: url,
       // data:  JSON.stringify(dados),
         data: dados,
        contentType: 'application/json',
        //dataType : 'json',
        success: function (dados) {
            //console.log(dados);
            var json = dados;//JSON.parse(dados);
            executar(json);
        },
        complete: function () {
            removerLoadAction();
        }
    });
}


function buscarDadosNoParseJSON(url, dados, executar) {
    escreverLoadAction();
    $.ajax({
        type: "POST",
        url: url,
        data: dados,
        contentType: 'application/json;charset=utf-8',
        success: function (dados) {
            executar(dados);
        },
        complete: function () {
            removerLoadAction();
        }
    });
}


function exibirMensagem(msg) {
    $("#msgResp").html(msg);
    $("#dialog").dialog();
    setTimeout(function () {
        $("#dialog").dialog('close')
    }, '5000');
}

function escreverLoadAction() {
    $("#dialogAguarde").dialog({
        modal: true,
    });
}

function removerLoadAction() {
    $("#dialogAguarde").dialog('close');
}