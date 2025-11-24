#!/usr/bin/env python3
import sys
import os
from pathlib import Path
import subprocess

def parse_patch(patch_text: str):
    """
    Espera bloques de la forma:

    ---FILE: ruta/del/archivo---
    contenido...
    ---END FILE---

    y devuelve una lista de (ruta, contenido).
    """
    files = []
    current_path = None
    current_lines = []

    for line in patch_text.splitlines(keepends=True):
        if line.startswith('---FILE:'):
            # Cerrar archivo anterior, si había
            if current_path is not None:
                files.append((current_path, ''.join(current_lines)))
                current_lines = []
            header = line.strip()
            # Ej: ---FILE: carpeta/archivo.ext---
            path = header.replace('---FILE:', '').replace('---', '').strip()
            current_path = path
        elif line.startswith('---END FILE---'):
            if current_path is not None:
                files.append((current_path, ''.join(current_lines)))
                current_path = None
                current_lines = []
        else:
            if current_path is not None:
                current_lines.append(line)

    # Por si quedó algo abierto
    if current_path is not None and current_lines:
        files.append((current_path, ''.join(current_lines)))

    return files

def apply_files(files):
    """
    Escribe cada archivo en disco, creando carpetas si hace falta.
    """
    for rel_path, content in files:
        path = Path(rel_path)
        parent = path.parent
        if str(parent) not in ("", "."):
            parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[OK] Escrito {rel_path}")

def run(cmd):
    print(f"$ {' '.join(cmd)}")
    result = subprocess.run(cmd)
    if result.returncode != 0:
        raise RuntimeError(f"Comando falló: {' '.join(cmd)}")

def main():
    if len(sys.argv) < 2:
        print("Uso: python apply_patch.py patch.txt [mensaje_commit]")
        sys.exit(1)

    patch_file = sys.argv[1]
    commit_message = sys.argv[2] if len(sys.argv) >= 3 else "apply IA patch"

    if not os.path.exists(patch_file):
        print(f"No existe el archivo de patch: {patch_file}")
        sys.exit(1)

    with open(patch_file, 'r', encoding='utf-8') as f:
        patch_text = f.read()

    files = parse_patch(patch_text)
    if not files:
        print("No se encontraron bloques ---FILE: ...--- en el patch.")
        sys.exit(1)

    print(f"Se van a aplicar {len(files)} archivos:")
    for rel_path, _ in files:
        print(f" - {rel_path}")

    # Escribir archivos
    apply_files(files)

    # git add sólo de esos archivos
    paths = [rel for rel, _ in files]
    run(["git", "add"] + paths)

    # Commit
    run(["git", "commit", "-m", commit_message])

    # Rama actual
    branch = subprocess.check_output(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        text=True
    ).strip()

    # Push
    run(["git", "push", "origin", branch])

    print("✅ Patch aplicado, commiteado y pusheado correctamente.")

if __name__ == "__main__":
    main()
