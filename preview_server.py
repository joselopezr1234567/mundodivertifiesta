import argparse
import http.server
import os
import re
import socket
import socketserver
import sys
from pathlib import Path

DEFAULT_PORT = 8000
DEFAULT_HOST = "0.0.0.0"
PROJECT_DIR = Path(__file__).resolve().parent
TEXT_EXTENSIONS = {".html", ".css", ".js"}
ROUTE_FIX_PATTERNS = (
    (r'([\'"])\/mundodivertifiesta\/', r"\1"),
)


class PreviewHandler(http.server.SimpleHTTPRequestHandler):
    """Handler simple con mejor logging y sin cache para pruebas locales."""

    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_DIR), **kwargs)

    def end_headers(self):
        # Evita que el navegador recicle HTML/JS viejos al probar cambios.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format_string, *args):
        message = format_string % args
        print(
            f"[{self.log_date_time_string()}] "
            f"{self.client_address[0]} - {message}"
        )


class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def fix_paths(root_dir: Path, dry_run: bool = False) -> int:
    """Corrige rutas absolutas del proyecto que rompen la vista local."""
    print("--- Auditoria de rutas ---")
    changed_files = 0

    for path in sorted(root_dir.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue

        try:
            content = path.read_text(encoding="utf-8")
        except Exception as exc:
            print(f"ERROR al leer {path.name}: {exc}")
            continue

        new_content = content
        replacements = 0
        for pattern, replacement in ROUTE_FIX_PATTERNS:
            new_content, count = re.subn(pattern, replacement, new_content)
            replacements += count

        if new_content == content:
            continue

        changed_files += 1
        relative_path = path.relative_to(root_dir)

        if dry_run:
            print(
                f"SIMULACION: se corregirian {replacements} ruta(s) en {relative_path}"
            )
            continue

        try:
            path.write_text(new_content, encoding="utf-8")
            print(f"OK: {relative_path} ({replacements} reemplazo(s))")
        except Exception as exc:
            print(f"ERROR al escribir {relative_path}: {exc}")

    if changed_files == 0:
        print("No se encontraron rutas para corregir.")

    return changed_files


def get_local_ip() -> str:
    """Intenta detectar una IP util de la maquina en la red local."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Servidor de pruebas para Mundodivertifiesta"
    )
    parser.add_argument(
        "--host",
        default=DEFAULT_HOST,
        help=f"Host de escucha. Por defecto: {DEFAULT_HOST}",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_PORT,
        help=f"Puerto de escucha. Por defecto: {DEFAULT_PORT}",
    )
    parser.add_argument(
        "--no-fix",
        action="store_true",
        help="No corrige rutas antes de iniciar el servidor.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Muestra las correcciones posibles y termina sin levantar el servidor.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    os.chdir(PROJECT_DIR)

    if not args.no_fix:
        fix_paths(PROJECT_DIR, dry_run=args.dry_run)

    if args.dry_run:
        print("\nModo simulacion finalizado. No se inicio el servidor.")
        return 0

    local_ip = get_local_ip()

    try:
        with ThreadingTCPServer((args.host, args.port), PreviewHandler) as httpd:
            print("\nMUNDODIVERTIFIESTA - SERVIDOR DE PRUEBAS")
            print("----------------------------------------")
            print(f"URL local: http://localhost:{args.port}/index.html")
            print(f"Red local: http://{local_ip}:{args.port}/index.html")
            print(f"Carpeta:   {PROJECT_DIR}")
            print("----------------------------------------")
            print("Presiona Ctrl+C para detener el servidor.\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido por el usuario.")
        return 0
    except OSError as exc:
        print(f"\nError al iniciar el servidor: {exc}")
        if exc.errno == 48:
            print(
                f"El puerto {args.port} ya esta en uso. "
                "Cierra el proceso actual o inicia con otro puerto."
            )
        return 1


if __name__ == "__main__":
    sys.exit(main())
