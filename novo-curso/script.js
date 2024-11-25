$(document).ready(function () {
    setTitle();
});

function setTitle(username) {
    $('#page_title').html(`${username ? username + " - " : ""}Cadastro de curso`)
}

async function onClickSalvar() {
    console.log('Salvar curso');
    
    try {
        // Obter os dados do curso do formulário
        const curso = {
            name: $('#nomeCurso').val().trim(),
            description: $('#descricaoCurso').val().trim(),
            platform: $('#plataforma').val().trim(),
            author: $('#autor').val().trim(),
            url: $('#url').val().trim(),
            popularity: $('#popularidade').val().trim(),
            logo: $('#logo').val().trim(),
            banner: $('#capa').var().trim()
        };

        // Verificar se todos os campos obrigatorios foram preenchidos
        if (!curso.name?.trim() || !curso.url?.trim()) {
            return alert('Preencha todos os campos obrigatorios (nome e url) antes de salvar!');
        }

        // Enviar os dados para a API
        const response = await fetch('http://localhost:3000/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(curso)
        });

        if (response.ok) {
            // Redirecionar para outra página após salvar
            location.href = '/index-curso/lista-curso/index.html';
        } else {
            const error = await response.json();
            alert(`Erro ao salvar: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao salvar curso:', error);
        alert('Erro ao se conectar à API. Tente novamente mais tarde.');
    }
}
