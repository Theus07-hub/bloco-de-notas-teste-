import sqlite3
import os

# Define o arquivo do SQLite na raiz do projeto (gby.db)
db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'gby.db')

conexao = sqlite3.connect(db_path, check_same_thread=False)
conexao.row_factory = sqlite3.Row  # Permite retornar resultados como dicionários

def criar_tabelas():
    cursor = conexao.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notebook (
            id_notebook INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            nome_notebook TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS section (
            id_section INTEGER PRIMARY KEY AUTOINCREMENT,
            notebook_id INTEGER,
            titulo_section TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pagina (
            id_pagina INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id INTEGER,
            titulo_page TEXT,
            conteudo TEXT,
            position INTEGER DEFAULT 0
        )
    """)
    conexao.commit()
    cursor.close()

criar_tabelas()
