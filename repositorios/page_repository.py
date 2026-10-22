from .conexao_repository import conexao


class PageRepository:
    def __init__(self):
        self.conexao = conexao

    def criar_pagina(self, section_id, titulo_page, conteudo, position=0):
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO pagina (section_id, titulo_page, conteudo, position) VALUES (?, ?, ?, ?)"
            cursor.execute(sql, (section_id, titulo_page, conteudo, position))
            self.conexao.commit()
            return cursor.lastrowid
        finally:
            cursor.close()

    def listar_pagina(self, section_id):
        cursor = self.conexao.cursor()
        try:
            cursor.execute("SELECT * FROM pagina WHERE section_id = ?", (section_id,))
            return [dict(row) for row in cursor.fetchall()]
        finally:
            cursor.close()

    def atualizar_pagina(self, id_page, titulo_page=None, conteudo=None):
        cursor = self.conexao.cursor()
        try:
            campos_atualizar = []
            valores = []

            if titulo_page is not None:
                campos_atualizar.append("titulo_page = ?")
                valores.append(titulo_page)

            if conteudo is not None:
                campos_atualizar.append("conteudo = ?")
                valores.append(conteudo)

            if not campos_atualizar:
                return

            valores.append(id_page)
            sql = f"UPDATE pagina SET {', '.join(campos_atualizar)} WHERE id_pagina = ?"
            cursor.execute(sql, tuple(valores))
            self.conexao.commit()
        finally:
            cursor.close()

    def apagar_pagina(self, id_page):
        cursor = self.conexao.cursor()
        try:
            cursor.execute("DELETE FROM pagina WHERE id_pagina = ?", (id_page,))
            self.conexao.commit()
        finally:
            cursor.close()
