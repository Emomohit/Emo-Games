import os
import sys
import xml.etree.ElementTree as ET
import subprocess
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

OMENMON_DIR = r"C:\Users\Mohit\Downloads\OmenMon-0.61.1-Release"
OMENMON_EXE = os.path.join(OMENMON_DIR, "OmenMon.exe")
OMENMON_XML = os.path.join(OMENMON_DIR, "OmenMon.xml")

def read_config():
    """Reads settings from OmenMon.xml"""
    if not os.path.exists(OMENMON_XML):
        print(f"[!] Error: OmenMon.xml not found at {OMENMON_XML}")
        return None
    try:
        tree = ET.parse(OMENMON_XML)
        print(f"[+] Successfully loaded OmenMon.xml")
        return tree
    except Exception as e:
        print(f"[!] XML Error: {e}")
        return None

def update_xml_setting(fan_preset=None, tgp_watts=None, rgb_color=None, over_clock=None, under_volt=None):
    """Updates OmenMon.xml with parameters from Web UI"""
    tree = read_config()
    if not tree:
        return False
    
    root = tree.getroot()
    config = root.find("Config")
    if config is None:
        config = ET.SubElement(root, "Config")
    
    if fan_preset:
        node = config.find("FanProgramDefault")
        if node is None:
            node = ET.SubElement(config, "FanProgramDefault")
        node.text = str(fan_preset).capitalize()
        print(f"[+] Updated FanProgramDefault -> {fan_preset}")
        
    if tgp_watts:
        node = config.find("GpuPowerDefault")
        if node is None:
            node = ET.SubElement(config, "GpuPowerDefault")
        node.text = "Maximum" if int(tgp_watts) >= 120 else "Balanced"
        print(f"[+] Updated GpuPowerDefault for TGP {tgp_watts}W")

    try:
        tree.write(OMENMON_XML, encoding="utf-8", xml_declaration=True)
        print(f"[✓] Saved changes to {OMENMON_XML}")
        return True
    except Exception as e:
        print(f"[!] Save Error: {e}")
        return False

class BridgeHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode('utf-8'))
            print(f"\n[HTTP REQ] Received Settings: {data}")
            
            success = update_xml_setting(
                fan_preset=data.get('fanPreset'),
                tgp_watts=data.get('tgpLimit'),
                rgb_color=data.get('rgbColor'),
                over_clock=data.get('overclock'),
                under_volt=data.get('undervolt')
            )
            
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": success, "message": "OmenMon.xml updated!"}).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "OmenMon Bridge Active", "xml": OMENMON_XML}).encode('utf-8'))

def start_bridge_server(port=8091):
    server = HTTPServer(('localhost', port), BridgeHandler)
    print(f"=== OMEN COMMAND CENTER HARDWARE BRIDGE SERVER ===")
    print(f"[+] Listening for Web UI hardware commands on http://localhost:{port}")
    print(f"[+] Direct OmenMon Config target: {OMENMON_XML}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[+] Bridge Server stopped.")

if __name__ == "__main__":
    start_bridge_server()
