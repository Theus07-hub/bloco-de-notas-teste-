from flask import Flask, jsonify, request, render_template
from repositorios.notebook_repository import NotebookRepository
from repositorios.section_repository import SectionRepository
from repositorios.page_repository import PageRepository


app = Flask(__name__)

notebook_repo = NotebookRepository()
section_repo = SectionRepository()
page_repo = PageRepository()


def dados_obrigatorios(*campos, permitir_vazios=()):
    dados = request.get_json(silent=True)

    if not isinstance(dados, dict):
        return None, (jsonify({
            'sucesso': False,
            'mensagem': 'Envie os dados no formato JSON.'
        }), 400)

    campos_ausentes = [
        campo for campo in campos
        if dados.get(campo) is None or (dados.get(campo) == '' and campo not in permitir_vazios)
    ]
    if campos_ausentes:
        return None, (jsonify({
            'sucesso': False,
            'mensagem': f"Campo obrigatório: {', '.join(campos_ausentes)}."
        }), 400)

    return dados, None


# ===================== Notebook =====================

@app.route('/api/notebook/<int:user_id>', methods=['GET'])
def listar_notebook(user_id):
    notebooks = notebook_repo.listar_notebook(user_id)
    return jsonify(notebooks)


@app.route('/api/notebook', methods=['POST'])
def criar_notebook():
    dados, erro = dados_obrigatorios('user_id', 'nome_notebook')
    if erro:
        return erro

    id_novo = notebook_repo.criar_notebook(dados['user_id'], dados['nome_notebook'])

    return jsonify({
        'sucesso': True,
        'id': id_novo,
        'mensagem': 'Notebook criado com sucesso!'
    }), 201


@app.route('/api/notebook/<int:id_notebook>', methods=['PUT'])
def atualizar_notebook(id_notebook):
    dados, erro = dados_obrigatorios('nome_notebook')
    if erro:
        return erro

    notebook_repo.atualizar_notebook(id_notebook, dados['nome_notebook'])

    return jsonify({
        'sucesso': True,
        'mensagem': 'Notebook atualizado com sucesso!'
    })


@app.route('/api/notebook/<int:id_notebook>', methods=['DELETE'])
def deletar_notebook(id_notebook):
    notebook_repo.deletar_notebook(id_notebook)

    return jsonify({
        'sucesso': True,
        'mensagem': 'Notebook apagado com sucesso!'
    })


# ===================== Section =====================

@app.route('/api/section/<int:notebook_id>', methods=['GET'])
def listar_section(notebook_id):
    sections = section_repo.listar_section(notebook_id)
    return jsonify(sections)


@app.route('/api/section/', methods=['POST'])
def criar_section():
    dados, erro = dados_obrigatorios('notebook_id', 'titulo_section')
    if erro:
        return erro

    novo_id = section_repo.criar_section(dados['notebook_id'], dados['titulo_section'])

    return jsonify({
        'sucesso': True,
        'id': novo_id,
        'mensagem': 'Seção criada com sucesso!'
    }), 201


@app.route('/api/section/<int:id_section>', methods=['PUT'])
def atualizar_section(id_section):
    dados, erro = dados_obrigatorios('titulo_section')
    if erro:
        return erro

    section_repo.atualizar_section(id_section, dados['titulo_section'])

    return jsonify({
        'sucesso': True,
        'mensagem': 'Seção atualizada com sucesso!'
    })


@app.route('/api/section/<int:id_section>', methods=['DELETE'])
def deletar_section(id_section):
    section_repo.deletar_section(id_section)

    return jsonify({
        'sucesso': True,
        'mensagem': 'Seção apagada com sucesso!'
    })


# ===================== Página =====================

@app.route('/api/pagina/<int:section_id>', methods=['GET'])
def listar_pagina(section_id):
    paginas = page_repo.listar_pagina(section_id)
    return jsonify(paginas)


@app.route('/api/pagina/', methods=['POST'])
def criar_pagina():
    dados, erro = dados_obrigatorios(
        'section_id', 'titulo_page', 'conteudo', permitir_vazios=('conteudo',)
    )
    if erro:
        return erro

    id_page = page_repo.criar_pagina(
        dados['section_id'],
        dados['titulo_page'],
        dados['conteudo']
    )

    return jsonify({
        'sucesso': True,
        'id': id_page,
        'mensagem': 'Página criada com sucesso.'
    }), 201


@app.route('/api/pagina/<int:id_page>', methods=['PUT'])
def atualizar_pagina(id_page):
    dados, erro = dados_obrigatorios(
        'titulo_page', 'conteudo', permitir_vazios=('conteudo',)
    )
    if erro:
        return erro

    page_repo.atualizar_pagina(id_page, dados['titulo_page'], dados['conteudo'])

    return jsonify({
        'sucesso': True,
        'mensagem': 'Página atualizada com sucesso!'
    })


@app.route('/api/pagina/<int:id_page>', methods=['DELETE'])
def apagar_pagina(id_page):
    page_repo.apagar_pagina(id_page)

    return jsonify({
        'sucesso': True,
        'mensagem': 'Página apagada com sucesso!'
    })


@app.route('/')
def front():
    return render_template('Nodev2.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000, debug=True)
