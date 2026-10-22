# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

GBY is a learning project for a web-based notebook. It is being migrated toward a Flask API backed by MySQL, while the existing UI remains a plain HTML/CSS/JavaScript interface.

The application has three nested resources:

- **Notebook**: belongs to a user (`user_id`).
- **Section**: belongs to a notebook (`notebook_id`).
- **Page**: belongs to a section (`section_id`), with title, content, and position.

`app.py` is the Flask entry point. It exposes API endpoints and delegates database work to repository classes; route functions should not contain SQL.

## Architecture

- `app.py`: creates `Flask(__name__)`, instantiates repositories, and defines HTTP routes. API routes return JSON using `jsonify`; POST/PUT route bodies are read with `request.get_json()`.
- `repositorios/conexao_repository.py`: opens the shared MySQL connection to database `notas` using `mysql.connector`.
- `repositorios/*_repository.py`: data-access layer. Each repository owns CRUD methods and should close its cursor in `finally`. Imports inside this package use relative imports, e.g. `from .conexao_repository import conexao`.
- `templates/Nodev2.html`: current notebook interface.
- `static/CSS/Node2.css` and `static/JS/botoes.js`: browser-side presentation and behavior.

The current `NotebookRepository` API is:

```python
criar_notebook(user_id, nome_notebook) -> new id
listar_notebook(user_id) -> list[dict]
atualizar_notebook(id_notebook, nome_notebook)
deletar_notebook(id_notebook)
```

The route convention under development is singular resource paths, such as `/api/notebook` and `/api/notebook/<int:id>`. Keep a resource's route functions and its repository method names aligned.

## Development commands (PowerShell)

Use the project virtual environment and run the Flask development server:

```powershell
.\.venv\Scripts\Activate.ps1
python app.py
```

Or run it without activating the environment:

```powershell
.\.venv\Scripts\python.exe app.py
```

The development server uses `debug=True` and normally listens on `http://127.0.0.1:5000`.

Check Python syntax without starting Flask:

```powershell
.\.venv\Scripts\python.exe -m py_compile app.py repositorios\*.py
```

There is currently no automated test suite or lint command configured. Exercise GET endpoints directly in a browser or PowerShell, for example:

```powershell
Invoke-WebRequest http://127.0.0.1:5000/api/notebook/1 -UseBasicParsing
```

For POST, PUT, and DELETE requests, send JSON with an API client or PowerShell `Invoke-RestMethod`; the JSON field names must match those read by the Flask route (for example, `user_id` and `nome_notebook`).

## Database expectations

The MySQL server must be running before importing `app.py`, because `conexao_repository.py` opens the connection during import. The active database is named `notas`.

The notebook routes expect the `notebook` table to include at least `id_notebook`, `user_id`, and `nome_notebook`. Repository SQL must use the exact primary-key names from the database schema (for example, `id_notebook`, not a generic `id`).
