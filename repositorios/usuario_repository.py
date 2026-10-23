from .conexao_repository import conexao

class UsuarioRepository():
    def __init__(self):
        self.conexao = conexao

    def validar_login(self,email,senha):
        cursor = self.conexao.cursor()
        try:
            sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?"
            cursor.execute(sql,(email,senha))
            resultado = cursor.fetchone()
            return dict(resultado) if resultado else None
        finally:
            cursor.close()
    
    def buscar_email(self,email):
        cursor = self.conexao.cursor()
        try:
            cursor.execute("SELECT * FROM usuarios WHERE email = ?", (email,))
            resultados = [dict(row) for row in cursor.fetchall()]

            return resultados
        finally:
            cursor.close()

    def criar_usuario(self, nome, email, senha):
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)"
            cursor.execute(sql, (nome, email, senha))
            self.conexao.commit()
            return cursor.lastrowid
        finally:
            cursor.close()