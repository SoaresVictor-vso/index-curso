$(document).ready(function () {
    setTitle();
});

function setTitle(username) {
    $('#page_title').html(`${username ? username + " - " : ""}Cadastro de curso`)
}

function onClickSalvar() {
    console.log('Salvar curso');
}