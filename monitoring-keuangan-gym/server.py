"""Server lokal sederhana. Jalankan: python server.py
Lalu buka alamat yang tampil dari HP (HP dan laptop harus satu Wi-Fi)."""
import http.server, socketserver, socket

PORT = 8000

def ip_lokal():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as srv:
    print(f"Laptop : http://localhost:{PORT}")
    print(f"HP     : http://{ip_lokal()}:{PORT}")
    print("Tekan Ctrl+C untuk berhenti.")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nBerhenti.")
