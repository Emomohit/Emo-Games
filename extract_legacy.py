import re
import os

# Create directories
os.makedirs("src/utils", exist_ok=True)
os.makedirs("src/components", exist_ok=True)
os.makedirs("src/games", exist_ok=True)

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Extract the GAME_MODULES script block
# It starts with "const GAME_MODULES = {};" and ends before "</script>"
match = re.search(r'(const GAME_MODULES = \{.*?\n\s*GAME_MODULES.*?)(?=</script>)', content, re.DOTALL)

if match:
    legacy_code = match.group(1)
    
    # We need to wrap it so it exports GAME_MODULES
    export_code = f"""// Legacy Game Modules extracted from old architecture
{legacy_code}

export default GAME_MODULES;
"""
    with open("src/utils/legacyGames.js", "w", encoding="utf-8") as f:
        f.write(export_code)
    print("Legacy games extracted successfully.")
else:
    print("Could not find GAME_MODULES in index.html.")
