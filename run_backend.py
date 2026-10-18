"""
PRAYAS — Academic Research Collaboration Platform
Backend entrypoint runner with automatic database initialization and seeding.
"""
import os
import sys
from backend.app import create_app

def main():
    app = create_app()
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1")
    print(f"==================================================")
    print(f"  PRAYAS Research OS - Academic Platform Backend  ")
    print(f"  URL: http://127.0.0.1:{port}                    ")
    print(f"  Design System API: http://127.0.0.1:{port}/api/design-system")
    print(f"==================================================")
    app.run(host="0.0.0.0", port=port, debug=debug)

if __name__ == "__main__":
    main()
