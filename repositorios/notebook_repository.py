from .conexao_repository import conexao

class NotebookRepository:
    def __init__(self):
       self.conexao = conexao

    def criar_notebook(self, user_id, nome_notebook):
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO notebook (user_id, nome_notebook) VALUES (?, ?)"
            cursor.execute(sql,(user_id, nome_notebook))
            self.conexao.commit()
            return cursor.lastrowid
        finally:
            cursor.close()

    def listar_notebook(self, user_id):
        cursor = self.conexao.cursor()
        try:
            cursor.execute("SELECT * FROM notebook WHERE user_id = ?", (user_id,))
            resultados = [dict(row) for row in cursor.fetchall()]
            return resultados
        finally:
            cursor.close()

    def atualizar_notebook(self, id_notebook, nome_notebook):
        cursor = self.conexao.cursor()
        try:
            sql = "UPDATE notebook SET nome_notebook = ? WHERE id_notebook = ?"
            cursor.execute(sql,(nome_notebook, id_notebook))
            self.conexao.commit()
        finally:
            cursor.close()

    def deletar_notebook(self, id_notebook):
        cursor = self.conexao.cursor()
        try:
            cursor.execute("DELETE FROM notebook WHERE id_notebook = ?", (id_notebook,))
            self.conexao.commit()
        finally:
            cursor.close()
