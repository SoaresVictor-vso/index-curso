$(document).ready(function () {

    // usuário de teste
    window.testUser = {
        email: "teste@gmail.com",
        password: "123456"
    };

});

async function onClickLogin() {
    console.log('login');
    try {
        
        // Obter valores do formulário
        const email = $('#email').val();
        const password = $('#password').val();

        //implementar tentativa de login
        let successfullyLogin = true;  //se logar com sucesso, mudar para true;

        if(successfullyLogin) {
            onLoginSuccessfully()
        } else {
            onBadCredentials(`Email e/ou senha incorreto`)
        }
        
    } catch (error) {
        console.error(error);
        return onBadCredentials(`Verificar conexão`);
    }

    
}

function onBadCredentials(msg) {
    $('#alert_text_login').html(msg);
}

function onLoginSuccessfully() {
    location.href = '/index-curso/novo-curso/index.html'
}