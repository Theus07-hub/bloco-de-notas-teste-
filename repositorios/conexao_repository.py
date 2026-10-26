import os
import psycopg2
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Conecta ao Neon (PostgreSQL) na nuvem
conexao = psycopg2.connect(DATABASE_URL)

def criar_tabelas():
    cursor = conexao.cursor()

    # 1. Tabela notebook
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notebook (
            id_notebook SERIAL PRIMARY KEY,
            user_id INTEGER,
            nome_notebook VARCHAR(150)
        );
    """)

    # 2. Tabela section
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS section (
            id_section SERIAL PRIMARY KEY,
            notebook_id INTEGER REFERENCES notebook(id_notebook) ON DELETE CASCADE,
            titulo_section VARCHAR(150)
        );
    """)

    # 3. Tabela pagina
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pagina (
            id_pagina SERIAL PRIMARY KEY,
            section_id INTEGER REFERENCES section(id_section) ON DELETE CASCADE,
            titulo_page VARCHAR(150),
            conteudo TEXT,
            position INTEGER DEFAULT 0
        );
    """)

    # 4. Tabela usuarios
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario SERIAL PRIMARY KEY,
            nome VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            senha VARCHAR(255)
        );
    """)

    # 5. Criar usuário padrão se não existir
    cursor.execute("""
        INSERT INTO usuarios (id_usuario, nome, email, senha)
        VALUES (1, 'Gaby', 'usergbyz@admin.com', '220625')
        ON CONFLICT (id_usuario) DO NOTHING;
    """)

    conexao.commit()
    cursor.close()

# Executa a criação das tabelas ao importar
criar_tabelas()
