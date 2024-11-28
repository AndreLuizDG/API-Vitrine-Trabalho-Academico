$(document).ready(function () {
    $('.tabs').tabs(); // habilita as guias da TAB
    $("select").formSelect(); //habilita os select
    $('textarea').characterCounter(); // contagem de caracteres em text area
    $('.dinheiro').mask('#####0.00', {reverse: true});
    // leitura de parametros para habilitar opcoes de menu

    if (window.location.pathname.includes("menu")) {
        var url = "../libs/soa/verificarParametros.php";
        var dados = "";
        var funcao = function (json) {
            for (var i = 0; json.length > i; i++) {
                if (json[i].exibir == 'NAO') {
                    $("#" + json[i].menu).addClass("oculto");
                    $("#" + json[i].menu).html("");
                } else {
                    if (json[i].menu == 'msgDeveParcelas') {
                        exibirMensagem("Você possui parcelas em aberto que estão vencidas!<br/> Procure o Departamento Financeiro do Unisalesiano.")
                    } else if (json[i].menu == 'CPA') {
                        exibirAvaliacaoCPA();
                    } else {
                        $("#" + json[i].menu).removeClass("oculto");
                    }
                }
            }
        }
        buscarDados(url, dados, funcao);
    }
});

function exibirAvaliacaoCPA() {
    var url = "../libs/soa/validarAplicacaoCPA.php";
    var dados = null;
    var funcao = function (json) {
        if(json[0].mensagem=='OK'){
            location.href = json[0].url;
        }
    }
    buscarDados(url, dados, funcao);
}


function mudarFigura(obj, novaFigura) {
    obj.src = novaFigura
}

function limparForm(id) {
    $('#' + id).each(function () {
        this.reset();
    });
}

function escreverBannerAviso(titulo, mensagem) {
    html = '<div class="row" id="bannerAviso">';
    html += '<div class="col s12 l2"></div>';
    html += '<div class="col s12 l8">';
    html += '    <div class="card blue-grey darken-1">';
    html += '        <div class="card-content white-text">';
    html += '            <span class="card-title center-align">' + titulo + '</span>';
    html += '            <p class="center-align">' + mensagem + '</p>';
    html += '        </div>';
    html += '    </div>';
    html += '</div>';
    html += '<div class="col s12 l2"></div>';
    html += '</div>';
    return html;
}

//*****************************************************************************
//                          MANIPULAÇÃO DE DATAS
//*****************************************************************************
function validarData(valor, lang) {
    var date = valor;
    var ardt = new Array;
    erro = false;
    if (lang == 'BR') {
        var ExpReg = new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
        ardt = date.split("/");
        if (date.search(ExpReg) == -1) {
            //console.log("Linha 1")
            erro = true;
        } else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[0] > 30)) {
            //console.log("Linha 2")
            erro = true;
        } else if (ardt[1] == 2) {
            //console.log("Linha 3")
            if ((ardt[0] > 28) && ((ardt[2] % 4) != 0)) {
                //console.log("Linha 4")
                erro = true;
            }
            if ((ardt[0] > 29) && ((ardt[2] % 4) == 0)) {
                //console.log("Linha 5")
                erro = true;
            }
        }
    } else {
        var ExpReg = new RegExp("[12][0-9]{3}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])");
        ardt = date.split("-");
        if (date.search(ExpReg) == -1) {
            //console.log("US linha1");
            erro = true;
        } else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[2] > 30)) {
            //console.log("US linha2");
            erro = true;
        } else if (ardt[1] == 2) {
            // console.log("US linha3");
            if ((ardt[2] > 28) && ((ardt[0] % 4) != 0)) {
                //     console.log("US linha4");
                erro = true;
            }
            if ((ardt[2] > 29) && ((ardt[0] % 4) == 0)) {
                //    console.log("US linha5");
                erro = true;
            }
        }
    }
    if (erro) {
        msg = '"' + valor + '" não é uma data válida!!!';
        exibirMensagem(msg);
        //campo.focus();
        //campo.value = "";
        return false;
    }
    return true;
}

function formatarDataBR(data) {
    dia = data.getDate().toString();
    diaF = (dia.length == 1) ? '0' + dia : dia;
    mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length == 1) ? '0' + mes : mes;
    anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

function formatarDataUS(data) {
    dia = data.getDate().toString();
    diaF = (dia.length == 1) ? '0' + dia : dia;
    mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length == 1) ? '0' + mes : mes;
    anoF = data.getFullYear();
    return anoF + "-" + mesF + "-" + diaF;
}

function saidaDataBR(data) {
    valor = data.split("-");
    diaF = valor[2];
    mesF = valor[1];
    anoF = valor[0];
    return diaF + "/" + mesF + "/" + anoF;
}

function dataAtualMaior(data) {
    var hoje = new Date();
    // necessário para poder comparar as datas no mesmo dia
    hoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    return hoje > data;
}
//*****************************************************************************
//***                               GERAL
//*****************************************************************************
function eDigito(c) {
    return ((c >= "0") && (c <= "9"));
}

function eNulo(s) {
    return ((s === null) || (s.length === 0));
}

function verificarCamposObrigatorios(idForm) {
    var valido = true;
    $("#" + idForm + " input").each(function () {
        $(this).css({"background-color": "#FFFFFF"});
        if ($(this).hasClass("obrigatorio")) {
            if (eNulo($(this).val())) {
                valido = false;
                $(this).css({"background-color": "#FFFFCC"});
            }
        }
    });
    $("#" + idForm + " text-area").each(function () {
        $(this).css({"background-color": "#FFFFFF"});
        if ($(this).hasClass("obrigatorio")) {
            if (eNulo($(this).val())) {
                valido = false;
                $(this).css({"background-color": "#FFFFCC"});
            }
        }
    });

    if (valido) {
        return valido;
    } else {
        exibirMensagem('Os campos em destaque são obrigatórios e devem estar preenchidos!');
        return valido;
    }
}

function retiraCaracteresInvalidos(strCampo, tam) {
    nTamanho = strCampo.length;
    szCampo = "";
    j = 0;
    for (i = nTamanho - 1; i >= 0; i--) {
        if (eDigito(strCampo.charAt(i))) {
            szCampo = strCampo.charAt(i) + szCampo;
            j++;
            if (j > tam)
                break;
        }
    }
    return szCampo;
}

function exibirMensagem(msg) {
    $("#msgResp").html(msg);
    $("#dialog").dialog();
    setTimeout(function () {
        $("#dialog").dialog('close')
    }, '5000');
}

function escreverLoadAction() {
//    $("#loadAction").html(" <div class='preloader-wrapper small active'><div class='spinner-layer spinner-blue-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>");
    $("#dialogAguarde").dialog({
        modal: true,
    });
    //$('dialogAguarde').filter('.ui-dialog-titlebar-close').addClass('oculto');
}

function removerLoadAction() {
    $("#dialogAguarde").dialog('close');
    //$("#loadAction").html("");
}

function buscarDados(url, dados, executar) {
    escreverLoadAction()
    $.ajax({
        type: "POST",
        url: url,
        data: dados,
        success: function (dados) {
            //console.log(dados);
            var json = JSON.parse(dados);
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
        success: function (dados) {
            executar(dados);
        },
        complete: function () {
            removerLoadAction();
        }
    });
}

function sair() {
    url = "../libs/soa/logout.php";
    dados = "";
    funcao = function (json) {
        window.location = json[0].url;
    }
    buscarDados(url, dados, funcao);
}

function sairProf() {
    url = "../libs/professores/soa/logout.php";
    dados = "";
    funcao = function (json) {
        window.location = json[0].url;
    }
    buscarDados(url, dados, funcao);
}

function corStatusMatricula(status) {
    var corFonte = "#0D47A1";
    if (status == 'APROVADO') {
        corFonte = "#0D47A1";
    } else if (status == 'CURSANDO') {
        corFonte = "#37474f";
    } else if (status == 'REPROVADO' || status == 'REPR.FALT') {
        corFonte = "#d32f2f";
    } else if (status == 'TRANCADO') {
        corFonte = "#fb8c00";
    } else if (status == 'DESISTENTE') {
        corFonte = "#9e9e9e";
    }
    return corFonte;
}
//****************************************************************************
//********** TELA MEDICINA ***************************************************
//****************************************************************************
function enviarLogin() {
    if (!$("#cpf").val() || !$("#senha").val()) {
        exibirMensagem("É necessário informar um CPF e/ou SENHA");
    } else {
        $("#fLogin")[0].submit();
    }
}
function buscarProfessor(cpf, idcasa) {
    $.ajax({
        type: "POST",
        url: "requests/obterProfessor.php",
        data: {cpf: cpf, idcasa: idcasa},
        success: function (dados) {
            $("#nomeProfessor").html(dados);
        },
        complete: function () {}
    });
}

function buscarCursos(pLetivo, cpf, idcasa) {
    $.ajax({
        type: "POST",
        url: "requests/buscarCursos.php",
        data: {cpf: cpf, idcasa: idcasa, pLetivo: pLetivo},
        success: function (dados) {
            $("#infoCurso").html(dados);
            $("#curso").formSelect();
        },
        complete: function () {}
    });
}

function buscarDisciplinas(curso, pLetivo, idcasa, cpf) {
    $.ajax({
        type: "POST",
        url: "requests/buscarDisciplinas.php",
        data: {cpf: cpf, idcasa: idcasa, pLetivo: pLetivo, curso: curso},
        success: function (dados) {
            $("#infoDisciplina").html(dados);
            $("#cod_disc").formSelect();
        },
        complete: function () {}
    });
}

function buscarAtividadesExtras(dados) {
    $("#cod_atividade").val("NOVO");
    var valor = dados.split("#");
    var codDisc = valor[0];
    var serie = valor[1];
    var turma = valor[2];
    $.ajax({
        type: "POST",
        url: "requests/buscarAtividadesExtras.php",
        data: {cpf: $("#cpf").val(), idcasa: $("#id_casa").val(), pLetivo: $("#p_letivo").val(), curso: $("#cod_curso").val(),
            codDisc: codDisc, serie: serie, turma: turma},
        success: function (dados) {
            $("#listaAtividades").html(dados);
        },
        complete: function () {}
    });

}

function adicionarAtividade() {
    if (!$("#nomeAtividade").val() || ($("#nomeAtividade").val().length < 5)) {
        exibirMensagem("É necessário informar um nome de atividade válido (ao menos 5 caracteres)");
        $("#nomeAtividade").focus()
        return;
    }
    if (!validarData($("#dataAtividade").val(), 'US')) {
        $("#dataAtividade").focus();
        return;
    }
    if (!validarData($("#dataEntrega").val(), 'US')) {
        $("#dataEntrega").focus();
        return;
    }
    var valor = $("#cod_disc").val().split("#");
    var codDisc = valor[0];
    var serie = valor[1];
    var turma = valor[2];
    $.ajax({
        type: "POST",
        url: "requests/salvarAtividadeExtra.php",
        data: {cpf: $("#cpf").val(), idcasa: $("#id_casa").val(), pLetivo: $("#p_letivo").val(), curso: $("#cod_curso").val(),
            codDisc: codDisc, serie: serie, turma: turma, codGrade: $("#cod_grade").val(), codAtividade: $("#cod_atividade").val(),
            nomeAtividade: $("#nomeAtividade").val(), dataAtividade: $("#dataAtividade").val(), dataEntrega: $("#dataEntrega").val()},
        success: function (dados) {
            exibirMensagem(dados);
            // apagar campos editavies do formulário
            $("#nomeAtividade").val("");
            $("#dataAtividade").val("");
            $("#dataEntrega").val("");
            $("#cod_atividade").val("NOVO");
            buscarAtividadesExtras($("#cod_disc").val())

        },
        complete: function () {}
    });
}

function editarAtividade(dados) {
    var valor = dados.split("#");
    $("#cod_atividade").val(valor[0]);
    $("#nomeAtividade").val(valor[1]);
    $("#dataAtividade").val(valor[2]);
    $("#dataEntrega").val(valor[3]);
}

//*****************************************************************************
// ATIVIDADES NOTAS
//*****************************************************************************
function buscarCursoDiscNotas(pLetivo, cpf, idcasa) {
    $("#infoCursoDisc").html("");
    $("#infoAtividadeNotas").html("");
    $("#listaAlunosNotas").html("");
    $.ajax({
        type: "POST",
        url: "requests/buscarCursoDiscNotas.php",
        data: {cpf: cpf, idcasa: idcasa, pLetivoNotas: pLetivo},
        success: function (dados) {
            $("#infoCursoDisc").html(dados);
            $("#cursoDiscNotas").formSelect();
        },
        complete: function () {}
    });
}

function buscarAtividadesDisciplina(dados) {
    $("#infoAtividadeNotas").html("");
    $("#listaAlunosNotas").html("");
    /* p_letivo, cod_curso, serie, turma, cod_disc, id_casa */
    var valor = dados.split("#");
    $.ajax({
        type: "POST",
        url: "requests/buscarAtividadesDiscNotas.php",
        data: {pLetivo: valor[0], cod_curso: valor[1], serie: valor[2], turma: valor[3], cod_disc: valor[4], idcasa: valor[5]},
        success: function (dados) {
            $("#infoAtividadeNotas").html(dados);
            $("#listaAtividadesNotas").formSelect();
        },
        complete: function () {}
    });
}

function buscarAlunosAtividadesExtra(dados) {
    $("#listaAlunosNotas").html("");
    /*p_letivo, cod_curso, serie, turma, cod_disc, id_casa, cod_atividade */
    var valor = dados.split("#");
    $.ajax({
        type: "POST",
        url: "requests/buscarAlunosAtividadesNotas.php",
        data: {pLetivo: valor[0], cod_curso: valor[1], serie: valor[2], turma: valor[3], cod_disc: valor[4], idcasa: valor[5], cod_atividade: valor[6]},
        success: function (dados) {
            $("#listaAlunosNotas").html(dados);
        },
        complete: function () {}
    });
}


function salvarNotasAtividades() {
    //criando os arrays de dados
    var ras = new Array();
    var notas = new Array();
    $("input[name='valoresRas[]']").each(function () {
        ras.push($(this).val());
    });

    continuar = true;
    $("input[name='notas[]']").each(function () {
        if ($(this).val() == "") {
            continuar = false;
        }
        notas.push($(this).val());
    });
    if (continuar) {
        $.ajax({
            type: "POST",
            url: "requests/salvarNotasAtivExt.php",
            data: {pletivo: $("#pletivoNotas").val(), curso: $("#cursoNotas").val(), serie: $("#serieNotas").val(), turma: $("#turmaNotas").val(), disc: $("#discNotas").val(),
                idcasa: $("#idcasaNotas").val(), cod_atividade: $("#cod_atividadeNotas").val(), ras: ras, notas: notas},
            success: function (dados) {
                exibirMensagem(dados);
                $("#pLetivoNotas").val("0");
                $("#infoCursoDisc").html("");
                $("#infoAtividadeNotas").html("");
                $("#listaAlunosNotas").html("");
            },
            complete: function () {}
        });
    } else {
        exibirMensagem("Há notas sem preencher!");
    }
}


function validarNota(input) {
    if (parseFloat(input.value) > 10) {
        exibirMensagem('A nota informada não pode ser superior a 10.0');
        input.focus();
        input.value = "";
    } else {
        if ((input.value.length == 2) && (parseFloat(input.value) >= 10)) {
            input.value = "10.0";
        } else {
            if ((input.value.length == 1) && (parseFloat(input.value) < 10)) {
                input.value = "0" + input.value + ".0";
            } else if ((input.value.length == 3) && (parseFloat(input.value) < 10)) {
                input.value = "0" + input.value;
            } else if ((input.value.length == 2) && (input.value.substring(1) == '.')) {
                input.value = "0" + input.value + "0";
            } else if ((input.value.length == 2) && (input.value.substring(0) == '.')) {
                input.value = "00" + input.value;
            }
        }
    }
    if ((input.value.substring(input.value.length - 1) != 0) &&
            (input.value.substring(input.value.length - 1) != 5)) {
        exibirMensagem('Informar as notas apenas com variações de 0.5 pontos!');
        input.focus();
        input.value = "";
    }
}

function apenasNumeros(input, evento) {
    var BACKSPACE = 8;
    var PONTO = 46;
    var FRENTE = 39;
    var TRAS = 37;
    var TAB = 9;
    var tecla = (evento.keyCode ? evento.keyCode : evento.which ? evento.which : evento.charCode)
    if ((tecla == BACKSPACE) || (tecla == PONTO) || (tecla == FRENTE) || (tecla == TRAS) || (tecla == TAB)) {
        return true;
    }
    if (tecla == 13)
        return false;

    if ((tecla < 48) || (tecla > 57)) {
        evento.returnValue = false;
        return false;
    }
    return true;
}

