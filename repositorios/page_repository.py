from .conexao_repository import conexao
from psycopg2.extras import RealDictCursor

class PageRepository:
    def __init__(self):
        self.conexao = conexao

    def criar_pagina(self, section_id, titulo_page, conteudo, position=0):
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO pagina (section_id, titulo_page, conteudo, position) VALUES (%s, %s, %s, %s) RETURNING id_pagina"
            cursor.execute(sql, (section_id, titulo_page, conteudo, position))
            self.conexao.commit()
            novo_id = cursor.fetchone()[0]
            return novo_id
        finally:
            cursor.close()

    def listar_pagina(self, section_id):
        cursor = self.conexao.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute("SELECT * FROM pagina WHERE section_id = %s", (section_id,))
            return cursor.fetchall()
        finally:
            cursor.close()

    def atualizar_pagina(self, id_page, titulo_page=None, conteudo=None):
        cursor = self.conexao.cursor()
        try:
            campos_atualizar = []
            valores = []

            if titulo_page is not None:
                campos_atualizar.append("titulo_page = %s")
                valores.append(titulo_page)

            if conteudo is not None:
                campos_atualizar.append("conteudo = %s")
                valores.append(conteudo)

            if not campos_atualizar:
                return

            valores.append(id_page)
            sql = f"UPDATE pagina SET {', '.join(campos_atualizar)} WHERE id_pagina = %s"
            cursor.execute(sql, tuple(valores))
            self.conexao.commit()
        finally:
            cursor.close()

    def apagar_pagina(self, id_page):
        cursor = self.conexao.cursor()
        try:
            cursor.execute("DELETE FROM pagina WHERE id_pagina = %s", (id_page,))
            self.conexao.commit()
        finally:
            cursor.close()
