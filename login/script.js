$(document).ready(function () {
});

async function onClickLogin() {
    console.log('login');
    try {
        
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
    location.href = '/novo-curso/index.html'
}