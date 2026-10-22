from .conexao_repository import conexao

class NotebookRepository:
    def __init__(self):
       self.conexao = conexao

    def criar_notebook(self, user_id, nome_notebook):
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO notebook (user_id, nome_notebook) VALUES (%s, %s)"
            cursor.execute(sql,(user_id, nome_notebook))
            self.conexao.commit()
            return cursor.lastrowid
        finally:
            cursor.close()

    def listar_notebook(self, user_id):
        cursor = self.conexao.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM notebook WHERE user_id = %s", (user_id,))
            resultados = cursor.fetchall()
            return resultados
        finally:
            cursor.close()


    def atualizar_notebook(self,id_notebook, nome_notebook):
        cursor = self.conexao.cursor()
        try:
            sql= "UPDATE NOTEBOOK SET nome_notebook = %s WHERE id_notebook = %s"
            cursor.execute(sql,(nome_notebook, id_notebook))
            self.conexao.commit()
        finally:
            cursor.close()


    def deletar_notebook(self, id_notebook):
        cursor = self.conexao.cursor()
        try:
            cursor.execute("DELETE FROM NOTEBOOK WHERE id_notebook = %s", (id_notebook,))
            self.conexao.commit()
        finally:
            cursor.close()