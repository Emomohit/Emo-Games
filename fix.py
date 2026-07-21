import os

# The missing games to inject into the GAMES array
extra_games = """
  { id:'flappy', title:'Flappy Box', emoji:'🐦', category:'arcade', span:true },
  { id:'breakout', title:'Brick Breaker', emoji:'🧱', category:'classic', span:false },
  { id:'minesweeper', title:'Minesweeper', emoji:'💣', category:'puzzle', span:false },
  { id:'reaction', title:'Reaction Test', emoji:'⚡', category:'reflex', span:false },
  { id:'colormatch', title:'Color Match', emoji:'🎨', category:'puzzle', span:false },
  { id:'mathquiz', title:'Math Quiz', emoji:'➕', category:'puzzle', span:false },
  { id:'clicker', title:'Cookie Clicker', emoji:'🍪', category:'strategy', span:true },
  { id:'simon', title:'Simon Says', emoji:'🔲', category:'memory', span:false },
  { id:'wordscramble', title:'Word Scramble', emoji:'📝', category:'puzzle', span:false },
  { id:'rps', title:'Rock Paper', emoji:'✂️', category:'strategy', span:false },
"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix literal \n\n
html = html.replace(r"\n\n", "\n\n")

# Inject GAMES
# Find the end of GAMES array
idx = html.find("];\n\n/* ============ Navigation ============ */")
if idx == -1:
    idx = html.find("];\r\n\r\n/* ============ Navigation ============ */")

if idx != -1:
    html = html[:idx] + extra_games + html[idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
