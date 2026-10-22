from .conexao_repository import conexao


class SectionRepository:
    def __init__(self):
        self.conexao = conexao

    def criar_section(self, notebook_id, titulo_section):
        """Cria uma nova section dentro de um notebook"""
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO section (notebook_id, titulo_section) VALUES (?, ?)"
            cursor.execute(sql, (notebook_id, titulo_section))
            self.conexao.commit()
            return cursor.lastrowid
        finally:
            cursor.close()

    def listar_section(self, notebook_id):
        """Lista todas as sections de um notebook específico"""
        cursor = self.conexao.cursor()
        try:
            cursor.execute("SELECT * FROM section WHERE notebook_id = ?", (notebook_id,))
            resultados = [dict(row) for row in cursor.fetchall()]
            return resultados
        finally:
            cursor.close()

    def atualizar_section(self, id_section, novo_titulo):
        """Atualiza o título de uma section específica"""
        cursor = self.conexao.cursor()
        try:
            sql = "UPDATE section SET titulo_section = ? WHERE id_section = ?"
            cursor.execute(sql, (novo_titulo, id_section))
            self.conexao.commit()
        finally:
            cursor.close()

    def deletar_section(self, id_section):
        """Deleta uma section específica"""
        cursor = self.conexao.cursor()
        try:
            cursor.execute("DELETE FROM section WHERE id_section = ?", (id_section,))
            self.conexao.commit()
        finally:
            cursor.close()
