from .conexao_repository import conexao
from psycopg2.extras import RealDictCursor

class UsuarioRepository():
    def __init__(self):
        self.conexao = conexao

    def validar_login(self,email,senha):
        cursor = self.conexao.cursor(cursor_factory=RealDictCursor)
        try:
            sql = "SELECT * FROM usuarios WHERE email = %s AND senha = %s"
            cursor.execute(sql,(email,senha))
            return  cursor.fetchone()
        finally:
            cursor.close()
    
    def buscar_email(self,email):
        cursor = self.conexao.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
            return cursor.fetchall()
        finally:
            cursor.close()

    def criar_usuario(self, nome, email, senha):
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s) RETURNING id_usuario"
            cursor.execute(sql, (nome, email, senha))
            self.conexao.commit()
            return cursor.fetchone()[0]
        finally:
            cursor.close()