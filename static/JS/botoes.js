const currentUserId = 1;

let selectedNotebookId = null;
let selectedSectionId = null;
let selectedPageId = null;
let paginasCarregadas = [];

const elementos = {
    status: document.getElementById('statusMensagem'),
    seletorNotebook: document.getElementById('seletorNotebook'),
    botaoAdicionarNotebook: document.getElementById('botaoAdicionarNotebook'),
    botaoRenomearNotebook: document.getElementById('botaoRenomearNotebook'),
    botaoExcluirNotebook: document.getElementById('botaoExcluirNotebook'),
    botaoAdicionarAba: document.getElementById('botaoAdicionarAba'),
    botaoRenomearAba: document.getElementById('botaoRenomearAba'),
    botaoExcluirAba: document.getElementById('botaoExcluirAba'),
    botaoAdicionarPagina: document.getElementById('botaoAdicionarPagina'),
    botaoExcluirPagina: document.getElementById('botaoExcluirPagina'),
    botaoSalvarNota: document.getElementById('botaoSalvarNota'),
    listaAbas: document.getElementById('listaAbas'),
    listaPaginas: document.getElementById('listaPaginas'),
    mensagemAbas: document.getElementById('mensagemAbas'),
    mensagemPaginas: document.getElementById('mensagemPaginas'),
    titulo: document.getElementById('textTitle'),
    conteudo: document.getElementById('textInput')
};

function mostrarStatus(mensagem) {
    elementos.status.textContent = mensagem;
}

function limparEditor() {
    selectedPageId = null;
    elementos.titulo.value = '';
    elementos.conteudo.value = '';
    elementos.titulo.disabled = true;
    elementos.conteudo.disabled = true;
    elementos.botaoSalvarNota.disabled = true;
}

function configurarMensagemVazia(elemento, mensagem, mostrar) {
    elemento.textContent = mensagem;
    elemento.hidden = !mostrar;
}

function solicitarTexto(titulo, valorPadrao = '') {
    return new Promise((resolve) => {
        try {
            const res = window.prompt(titulo, valorPadrao);
            if (res !== null) {
                resolve(res);
                return;
            }
            resolve(null);
        } catch (e) {
            criarModalPrompt(titulo, valorPadrao, resolve);
        }
    });
}

function criarModalPrompt(titulo, valorPadrao, resolve) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999;';

    const box = document.createElement('div');
    box.style.cssText = 'background:white;padding:20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);width:320px;display:flex;flex-direction:column;gap:10px;font-family:Arial,sans-serif;';

    const label = document.createElement('label');
    label.textContent = titulo;
    label.style.cssText = 'font-weight:bold;font-size:0.95rem;color:#38232a;';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = valorPadrao;
    input.style.cssText = 'padding:8px;border:1px solid #d79aaa;border-radius:4px;font-size:1rem;width:100%;outline:none;';

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;margin-top:5px;';

    const btnCancelar = document.createElement('button');
    btnCancelar.type = 'button';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.style.cssText = 'background:#ccc;color:#333;padding:6px 12px;border:0;border-radius:4px;cursor:pointer;';

    const btnOk = document.createElement('button');
    btnOk.type = 'button';
    btnOk.textContent = 'OK';
    btnOk.style.cssText = 'background:#c45072;color:white;padding:6px 12px;border:0;border-radius:4px;cursor:pointer;';

    btnContainer.appendChild(btnCancelar);
    btnContainer.appendChild(btnOk);
    box.appendChild(label);
    box.appendChild(input);
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    input.focus();
    input.select();

    const fechar = (valor) => {
        document.body.removeChild(overlay);
        resolve(valor);
    };

    btnOk.addEventListener('click', () => fechar(input.value));
    btnCancelar.addEventListener('click', () => fechar(null));
    input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') fechar(input.value);
        if (ev.key === 'Escape') fechar(null);
    });
}

async function requisicao(url, opcoes = {}) {
    const configuracao = { ...opcoes };
    configuracao.headers = {
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
        ...opcoes.headers
    };

    const resposta = await fetch(url, configuracao);
    let dados;
    try {
        dados = await resposta.json();
    } catch (e) {
        dados = { mensagem: 'Erro na resposta do servidor.' };
    }

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Não foi possível concluir a operação.');
    }

    return dados;
}

function criarBotaoNavegacao(texto, id, ativo, aoClicar) {
    const item = document.createElement('li');
    const botao = document.createElement('button');

    botao.type = 'button';
    botao.className = 'item-navegacao';
    botao.dataset.id = id;
    botao.textContent = texto;

    if (ativo) {
        botao.classList.add('ativo');
    }

    botao.addEventListener('click', aoClicar);
    item.appendChild(botao);
    return item;
}

async function carregarNotebooks(idParaSelecionar = null) {
    try {
        mostrarStatus('Carregando notebooks...');
        const notebooks = await requisicao(`/api/notebook/${currentUserId}`);

        elementos.seletorNotebook.replaceChildren();
        elementos.seletorNotebook.disabled = false;

        if (notebooks.length === 0) {
            const novoNb = await requisicao('/api/notebook', {
                method: 'POST',
                body: JSON.stringify({ user_id: currentUserId, nome_notebook: 'Meu Notebook' })
            });
            await carregarNotebooks(novoNb.id);
            return;
        }

        for (const notebook of notebooks) {
            const opcao = new Option(notebook.nome_notebook, notebook.id_notebook);
            elementos.seletorNotebook.add(opcao);
        }

        const notebookEscolhido = idParaSelecionar || notebooks[0].id_notebook;
        elementos.seletorNotebook.value = String(notebookEscolhido);
        await selecionarNotebook(notebookEscolhido);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function selecionarNotebook(idNotebook) {
    if (!idNotebook) {
        selectedNotebookId = null;
        limparEditor();
        await carregarSections();
        return;
    }
    selectedNotebookId = Number(idNotebook);
    selectedSectionId = null;
    limparEditor();
    await carregarSections();
    mostrarStatus('Notebook selecionado.');
}

async function carregarSections(idParaSelecionar = null) {
    elementos.listaAbas.replaceChildren();
    elementos.listaPaginas.replaceChildren();
    selectedSectionId = null;
    paginasCarregadas = [];
    limparEditor();

    if (!selectedNotebookId) {
        configurarMensagemVazia(elementos.mensagemAbas, 'Selecione um notebook.', true);
        configurarMensagemVazia(elementos.mensagemPaginas, 'Selecione uma aba.', true);
        return;
    }

    try {
        const sections = await requisicao(`/api/section/${selectedNotebookId}`);

        if (sections.length === 0) {
            configurarMensagemVazia(elementos.mensagemAbas, 'Nenhuma aba encontrada. Clique em "Nova" para criar.', true);
            configurarMensagemVazia(elementos.mensagemPaginas, 'Selecione uma aba.', true);
            limparEditor();
            return;
        }

        configurarMensagemVazia(elementos.mensagemAbas, 'Adicione uma aba.', false);

        for (const section of sections) {
            const botao = criarBotaoNavegacao(
                section.titulo_section,
                section.id_section,
                Number(section.id_section) === Number(selectedSectionId),
                () => selecionarSection(section.id_section)
            );
            elementos.listaAbas.appendChild(botao);
        }

        const secaoEscolhida = idParaSelecionar || sections[0].id_section;
        await selecionarSection(secaoEscolhida);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function selecionarSection(idSection) {
    selectedSectionId = Number(idSection);
    limparEditor();
    await carregarSectionsRenderizadas();
    await carregarPaginas();
    mostrarStatus('Aba selecionada.');
}

async function carregarSectionsRenderizadas() {
    const botoes = elementos.listaAbas.querySelectorAll('button');
    botoes.forEach((botao) => {
        botao.classList.toggle('ativo', Number(botao.dataset.id) === selectedSectionId);
    });
}

async function carregarPaginas(idParaSelecionar = null) {
    elementos.listaPaginas.replaceChildren();
    paginasCarregadas = [];

    if (!selectedSectionId) {
        configurarMensagemVazia(elementos.mensagemPaginas, 'Selecione uma aba.', true);
        return;
    }

    try {
        paginasCarregadas = await requisicao(`/api/pagina/${selectedSectionId}`);

        if (paginasCarregadas.length === 0) {
            configurarMensagemVazia(elementos.mensagemPaginas, 'Nenhuma página encontrada. Clique em "Nova" para criar.', true);
            limparEditor();
            return;
        }

        configurarMensagemVazia(elementos.mensagemPaginas, 'Adicione uma página.', false);

        for (const pagina of paginasCarregadas) {
            const item = criarBotaoNavegacao(
                pagina.titulo_page,
                pagina.id_pagina,
                Number(pagina.id_pagina) === Number(selectedPageId),
                () => selecionarPagina(pagina.id_pagina)
            );
            elementos.listaPaginas.appendChild(item);
        }

        const paginaEscolhida = idParaSelecionar || (paginasCarregadas[0] ? paginasCarregadas[0].id_pagina : null);
        if (paginaEscolhida) {
            selecionarPagina(paginaEscolhida);
        }
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

function selecionarPagina(idPagina) {
    const pagina = paginasCarregadas.find((item) => Number(item.id_pagina) === Number(idPagina));
    if (!pagina) {
        return;
    }

    selectedPageId = Number(pagina.id_pagina);
    elementos.titulo.value = pagina.titulo_page || '';
    elementos.conteudo.value = pagina.conteudo || '';
    elementos.titulo.disabled = false;
    elementos.conteudo.disabled = false;
    elementos.botaoSalvarNota.disabled = false;

    const botoes = elementos.listaPaginas.querySelectorAll('button');
    botoes.forEach((botao) => {
        botao.classList.toggle('ativo', Number(botao.dataset.id) === selectedPageId);
    });
}

async function adicionarNotebook() {
    const nomeNotebook = await solicitarTexto('Qual é o nome do novo notebook?');
    if (!nomeNotebook || !nomeNotebook.trim()) {
        return;
    }

    try {
        const resposta = await requisicao('/api/notebook', {
            method: 'POST',
            body: JSON.stringify({
                user_id: currentUserId,
                nome_notebook: nomeNotebook.trim()
            })
        });

        await carregarNotebooks(resposta.id);
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function renomearNotebook() {
    if (!selectedNotebookId) {
        mostrarStatus('Selecione um notebook para renomear.');
        return;
    }
    const nomeAtual = elementos.seletorNotebook.options[elementos.seletorNotebook.selectedIndex].text;
    const novoNome = await solicitarTexto('Novo nome para o notebook:', nomeAtual);
    if (!novoNome || !novoNome.trim()) {
        return;
    }

    try {
        const resposta = await requisicao(`/api/notebook/${selectedNotebookId}`, {
            method: 'PUT',
            body: JSON.stringify({ nome_notebook: novoNome.trim() })
        });
        await carregarNotebooks(selectedNotebookId);
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function deletarNotebook() {
    if (!selectedNotebookId) {
        mostrarStatus('Selecione um notebook para apagar.');
        return;
    }
    if (!window.confirm('Tem certeza que deseja apagar este notebook e todas as suas abas e páginas?')) {
        return;
    }

    try {
        const resposta = await requisicao(`/api/notebook/${selectedNotebookId}`, {
            method: 'DELETE'
        });
        await carregarNotebooks();
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function adicionarAba() {
    if (!selectedNotebookId) {
        mostrarStatus('Selecione um notebook antes de adicionar uma aba.');
        return;
    }

    const tituloSection = await solicitarTexto('Qual é o nome da nova aba?');
    if (!tituloSection || !tituloSection.trim()) {
        return;
    }

    try {
        const resposta = await requisicao('/api/section/', {
            method: 'POST',
            body: JSON.stringify({
                notebook_id: selectedNotebookId,
                titulo_section: tituloSection.trim()
            })
        });

        await carregarSections(resposta.id);
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function renomearAba() {
    if (!selectedSectionId) {
        mostrarStatus('Selecione uma aba para renomear.');
        return;
    }
    const botaoAtivo = elementos.listaAbas.querySelector('button.ativo');
    const nomeAtual = botaoAtivo ? botaoAtivo.textContent : '';
    const novoNome = await solicitarTexto('Novo nome para a aba:', nomeAtual);
    if (!novoNome || !novoNome.trim()) {
        return;
    }

    try {
        const resposta = await requisicao(`/api/section/${selectedSectionId}`, {
            method: 'PUT',
            body: JSON.stringify({ titulo_section: novoNome.trim() })
        });
        await carregarSections(selectedSectionId);
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function deletarAba() {
    if (!selectedSectionId) {
        mostrarStatus('Selecione uma aba para apagar.');
        return;
    }
    if (!window.confirm('Tem certeza que deseja apagar esta aba e todas as suas páginas?')) {
        return;
    }

    try {
        const resposta = await requisicao(`/api/section/${selectedSectionId}`, {
            method: 'DELETE'
        });
        await carregarSections();
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function adicionarPagina() {
    if (!selectedSectionId) {
        mostrarStatus('Selecione uma aba antes de adicionar uma página.');
        return;
    }

    const tituloPagina = await solicitarTexto('Qual é o título da nova página?', 'Nova página');
    if (!tituloPagina) {
        return;
    }

    try {
        const resposta = await requisicao('/api/pagina/', {
            method: 'POST',
            body: JSON.stringify({
                section_id: selectedSectionId,
                titulo_page: tituloPagina.trim(),
                conteudo: ''
            })
        });

        await carregarPaginas(resposta.id);
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function deletarPagina() {
    if (!selectedPageId) {
        mostrarStatus('Selecione uma página para apagar.');
        return;
    }
    if (!window.confirm('Tem certeza que deseja apagar esta página?')) {
        return;
    }

    try {
        const resposta = await requisicao(`/api/pagina/${selectedPageId}`, {
            method: 'DELETE'
        });
        await carregarPaginas();
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

async function salvarNota() {
    if (!selectedPageId) {
        mostrarStatus('Selecione uma página antes de salvar.');
        return;
    }

    const tituloPage = elementos.titulo.value.trim();
    if (!tituloPage) {
        mostrarStatus('Informe um título para a página.');
        return;
    }

    try {
        const resposta = await requisicao(`/api/pagina/${selectedPageId}`, {
            method: 'PUT',
            body: JSON.stringify({
                titulo_page: tituloPage,
                conteudo: elementos.conteudo.value
            })
        });

        await carregarPaginas(selectedPageId);
        mostrarStatus(resposta.mensagem);
    } catch (erro) {
        mostrarStatus(erro.message);
    }
}

elementos.seletorNotebook.addEventListener('change', (evento) => {
    selecionarNotebook(evento.target.value);
});
elementos.botaoAdicionarNotebook.addEventListener('click', adicionarNotebook);
elementos.botaoRenomearNotebook.addEventListener('click5', renomearNotebook); // wait, let's keep click
elementos.botaoRenomearNotebook.addEventListener('click', renomearNotebook);
elementos.botaoExcluirNotebook.addEventListener('click', deletarNotebook);

elementos.botaoAdicionarAba.addEventListener('click', adicionarAba);
elementos.botaoRenomearAba.addEventListener('click', renomearAba);
elementos.botaoExcluirAba.addEventListener('click', deletarAba);

elementos.botaoAdicionarPagina.addEventListener('click', adicionarPagina);
elementos.botaoExcluirPagina.addEventListener('click', deletarPagina);

elementos.botaoSalvarNota.addEventListener('click', salvarNota);

carregarNotebooks();
