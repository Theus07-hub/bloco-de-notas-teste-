from .conexao_repository import conexao
from psycopg2.extras import RealDictCursor


class SectionRepository:
    def __init__(self):
        self.conexao = conexao

    def criar_section(self, notebook_id, titulo_section):
        """Cria uma nova section dentro de um notebook"""
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO section (notebook_id, titulo_section) VALUES (%s, %s) RETURNING id_section"
            cursor.execute(sql, (notebook_id, titulo_section))
            self.conexao.commit()
            return cursor.fetchone()[0] 
        finally:
            cursor.close()

    def listar_section(self, notebook_id):
        """Lista todas as sections de um notebook específico"""
        cursor = self.conexao.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute("SELECT * FROM section WHERE notebook_id = %s", (notebook_id,))
            return cursor.fetchall()
        finally:
            cursor.close()

    def atualizar_section(self, id_section, novo_titulo):
        """Atualiza o título de uma section específica"""
        cursor = self.conexao.cursor()
        try:
            sql = "UPDATE section SET titulo_section = %s WHERE id_section = %s"
            cursor.execute(sql, (novo_titulo, id_section))
            self.conexao.commit()
        finally:
            cursor.close()

    def deletar_section(self, id_section):
        """Deleta uma section específica"""
        cursor = self.conexao.cursor()
        try:
            cursor.execute("DELETE FROM section WHERE id_section = %s", (id_section,))
            self.conexao.commit()
        finally:
            cursor.close()
