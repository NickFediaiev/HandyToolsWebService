// Tool: PICO-8 Function Reference
// Tab-based reference for all PICO-8 built-in functions and patterns

import { useState, useMemo } from 'react'
import clsx from 'clsx'

interface RefEntry {
  sig: string
  desc?: string
}

interface RefCard {
  title: string
  entries?: RefEntry[]
  tableData?: [string, string][]
  codeBlock?: string
  tip?: string
}

interface Pico8Tab {
  id: string
  label: string
  subtitle: string
  cards: RefCard[]
}

const TABS: Pico8Tab[] = [
  {
    id: 'graphics',
    label: '🎨 Graphics',
    subtitle: 'Screen is 128×128 px, origin top-left',
    cards: [
      {
        title: 'DRAW PRIMITIVES',
        entries: [
          { sig: 'pset(x,y,c)', desc: 'Set pixel at x,y to color c' },
          { sig: 'pget(x,y)', desc: 'Get color of pixel at x,y' },
          { sig: 'line(x0,y0,x1,y1,c)', desc: 'Draw line. Omit c → use draw color' },
          { sig: 'rect(x0,y0,x1,y1,c)', desc: 'Draw unfilled rect' },
          { sig: 'rectfill(x0,y0,x1,y1,c)', desc: 'Draw filled rect' },
          { sig: 'circ(x,y,r,c)', desc: 'Draw unfilled circle' },
          { sig: 'circfill(x,y,r,c)', desc: 'Draw filled circle' },
          { sig: 'oval(x0,y0,x1,y1,c)', desc: 'Unfilled oval (0.2.0+)' },
          { sig: 'ovalfill(x0,y0,x1,y1,c)', desc: 'Filled oval (0.2.0+)' },
        ],
      },
      {
        title: 'SPRITE & MAP DRAW',
        entries: [
          { sig: 'spr(n,x,y,[w,h,fx,fy])', desc: 'Draw sprite n at x,y. w/h in sprites (default 1). fx/fy=flip' },
          { sig: 'sspr(sx,sy,sw,sh,dx,dy,[dw,dh,fx,fy])', desc: 'Stretch sprite from spritesheet region to screen rect' },
          { sig: 'map(cx,cy,sx,sy,cw,ch,[layer])', desc: 'Draw map cells cx,cy to screen sx,sy. layer=flag bitmask filter' },
        ],
      },
      {
        title: 'TEXT & COLOR',
        entries: [
          { sig: 'print(str,[x,y,c])', desc: 'Print string. Without x,y uses cursor + newlines. Returns x after string' },
          { sig: 'color(c)', desc: 'Set global draw color (0-15)' },
          { sig: 'cursor(x,y,[c])', desc: 'Set print cursor position and optional color' },
          { sig: 'cls([c])', desc: 'Clear screen to color c (default 0/black)' },
        ],
      },
      {
        title: 'CAMERA & CLIP',
        entries: [
          { sig: 'camera([x,y])', desc: 'Shift world draw by -x,-y. No args → reset' },
          { sig: 'clip([x,y,w,h])', desc: 'Set draw clipping rect. No args → reset to full screen' },
          { sig: 'fillp([pat])', desc: 'Set fill pattern (16-bit). Use 0b prefix for binary literals' },
        ],
      },
      {
        title: 'PALETTE TRICKS',
        entries: [
          { sig: 'pal(c0,c1,[p])', desc: 'Remap color c0 → c1. p=0 draw palette, p=1 screen palette' },
          { sig: 'pal()', desc: 'Reset all palette remaps' },
          { sig: 'palt(c,t)', desc: 'Set color c transparent (t=true/false). Default: color 0 is transparent' },
          { sig: 'palt()', desc: 'Reset transparency (only 0 is transparent)' },
        ],
      },
      {
        title: 'PRINT SPECIAL CHARS',
        entries: [
          { sig: '"\\n"', desc: 'Newline in print string' },
          { sig: '"\\#7" or "\\*"', desc: 'Inline color change (char code 7 + color 0-15)' },
          { sig: 'print("hello", 0, 0, 7)', desc: 'White text at 0,0' },
        ],
        tip: 'Each char is 4×6px. Screen fits 32 cols × 21 rows of text.',
      },
    ],
  },
  {
    id: 'input',
    label: '🕹️ Input',
    subtitle: 'Player 0 & 1',
    cards: [
      {
        title: 'BUTTON FUNCTIONS',
        entries: [
          { sig: 'btn(b,[p])', desc: 'Returns true while button b held. p=player (0 or 1)' },
          { sig: 'btnp(b,[p])', desc: 'Returns true on first press (+ repeat after delay). Good for menus' },
        ],
      },
      {
        title: 'BUTTON INDICES',
        tableData: [
          ['0 — ⬅ LEFT', 'Arrow Left / S'],
          ['1 — ➡ RIGHT', 'Arrow Right / F'],
          ['2 — ⬆ UP', 'Arrow Up / E'],
          ['3 — ⬇ DOWN', 'Arrow Down / D'],
          ['4 — ❎ O / Z', 'Z / C / N'],
          ['5 — 🅾 X / C', 'X / V / M'],
        ],
        tip: 'Use constants ⬅ ➡ ⬆ ⬇ ❎ 🅾 in the editor instead of numbers.',
      },
      {
        title: 'MOUSE & KEYBOARD',
        entries: [
          { sig: 'stat(32)', desc: 'Mouse X (requires poke(0x5f2d,1) to enable mouse)' },
          { sig: 'stat(33)', desc: 'Mouse Y' },
          { sig: 'stat(34)', desc: 'Mouse buttons bitmask (bit 0=left, 1=right, 2=middle)' },
          { sig: 'stat(31)', desc: 'Last key pressed as string' },
        ],
      },
    ],
  },
  {
    id: 'audio',
    label: '🔊 Audio',
    subtitle: 'SFX (0-63) & Music (0-63)',
    cards: [
      {
        title: 'SOUND EFFECTS',
        entries: [
          { sig: 'sfx(n,[ch,off,len])', desc: 'Play sfx n (0-63). ch=-1 auto, off=note offset, len=note count' },
          { sig: 'sfx(-1)', desc: 'Stop all SFX' },
          { sig: 'sfx(-2)', desc: 'Stop looping SFX on all channels' },
        ],
      },
      {
        title: 'MUSIC',
        entries: [
          { sig: 'music(n,[fade,mask])', desc: 'Play music pattern n. fade=fadeout ms. mask=channel bitmask (1-15)' },
          { sig: 'music(-1)', desc: 'Stop music' },
        ],
        tip: 'Channels 0-3. A channel can be reserved for SFX by excluding it from the mask.',
      },
    ],
  },
  {
    id: 'math',
    label: '📐 Math',
    subtitle: 'All numbers are 16.16 fixed-point',
    cards: [
      {
        title: 'BASIC MATH',
        entries: [
          { sig: 'abs(x)', desc: 'Absolute value' },
          { sig: 'ceil(x)', desc: 'Round up' },
          { sig: 'flr(x)', desc: 'Floor (round down)' },
          { sig: 'max(x,y)', desc: 'Larger of two values' },
          { sig: 'min(x,y)', desc: 'Smaller of two values' },
          { sig: 'mid(x,y,z)', desc: 'Middle of three values — great for clamping!' },
          { sig: 'sgn(x)', desc: 'Sign: returns 1 or -1' },
          { sig: 'sqrt(x)', desc: 'Square root' },
        ],
      },
      {
        title: 'TRIG & RANDOM',
        entries: [
          { sig: 'sin(x) / cos(x)', desc: '⚠ Input is 0..1 (not radians!). sin is negated vs standard. cos(0)=1, sin(0.25)=-1' },
          { sig: 'atan2(dx,dy)', desc: 'Returns angle 0..1 (not radians). Note: dx first, dy second!' },
          { sig: 'rnd(x)', desc: 'Random float 0 ≤ r < x. flr(rnd(6))+1 = d6 roll' },
          { sig: 'srand(x)', desc: 'Set random seed' },
        ],
      },
      {
        title: 'BITWISE OPS',
        entries: [
          { sig: 'band(x,y)   &', desc: 'Bitwise AND' },
          { sig: 'bor(x,y)    |', desc: 'Bitwise OR' },
          { sig: 'bxor(x,y)   ^^', desc: 'Bitwise XOR' },
          { sig: 'bnot(x)     ~', desc: 'Bitwise NOT' },
          { sig: 'shl(x,n)    <<', desc: 'Shift left n bits' },
          { sig: 'shr(x,n)    >>', desc: 'Arithmetic shift right' },
          { sig: 'lshr(x,n)   >>>', desc: 'Logical shift right' },
        ],
      },
    ],
  },
  {
    id: 'table',
    label: '📦 Table',
    subtitle: 'Lua tables = arrays + dicts',
    cards: [
      {
        title: 'TABLE FUNCTIONS',
        entries: [
          { sig: 'add(t,v,[i])', desc: 'Append v to table t. Optional index i to insert at position' },
          { sig: 'del(t,v)', desc: 'Remove first occurrence of v from table t' },
          { sig: 'deli(t,i)', desc: 'Remove element at index i' },
          { sig: 'count(t)', desc: 'Number of elements (like #t but works on all tables)' },
          { sig: 'all(t)', desc: 'Iterator for "for v in all(t)" loops' },
          { sig: 'foreach(t,f)', desc: 'Call f(v) for each element in t' },
          { sig: 'pairs(t)', desc: 'Iterator for key-value pairs: "for k,v in pairs(t)"' },
        ],
      },
      {
        title: 'COMMON PATTERNS',
        codeBlock: `-- array literal
local a = {1, 2, 3}

-- object literal
local p = {x=0, y=0, spd=2}

-- safe delete while iterating
for b in all(bullets) do
  if b.dead then del(bullets, b) end
end

-- numeric for
for i=1,#a do ... end`,
      },
    ],
  },
  {
    id: 'string',
    label: '🔤 String',
    subtitle: 'Lua string library',
    cards: [
      {
        title: 'STRING FUNCTIONS',
        entries: [
          { sig: 'tostr(x,[hex])', desc: 'Number/bool → string. hex=true for hex output' },
          { sig: 'tonum(s)', desc: 'String → number' },
          { sig: 'sub(s,i,[j])', desc: 'Substring from i to j (1-indexed, negative = from end)' },
          { sig: 'ord(s,[i])', desc: 'Char code at position i (default 1)' },
          { sig: 'chr(n)', desc: 'Char code n → string character' },
          { sig: 'split(s,[sep,cnv])', desc: 'Split string into table. sep=separator (default ","), cnv=convert to numbers' },
          { sig: '#s  or  count(s)', desc: 'String length' },
          { sig: 's1 .. s2', desc: 'String concatenation' },
        ],
      },
    ],
  },
  {
    id: 'system',
    label: '⚙️ System',
    subtitle: 'Game loop, state, timing',
    cards: [
      {
        title: 'GAME LOOP CALLBACKS',
        entries: [
          { sig: 'function _init()', desc: 'Called once on start / reset. Init state here' },
          { sig: 'function _update()', desc: 'Called at 30fps. Game logic goes here' },
          { sig: 'function _update60()', desc: 'Called at 60fps — use instead of _update for 60fps mode' },
          { sig: 'function _draw()', desc: 'Called after _update. All draw calls go here' },
        ],
      },
      {
        title: 'SYSTEM FUNCTIONS',
        entries: [
          { sig: 'time() / t()', desc: 'Seconds since cart started' },
          { sig: 'stat(0)', desc: 'CPU usage (0..1). >1 = dropping frames' },
          { sig: 'stat(1)', desc: 'RAM usage (bytes)' },
          { sig: 'stat(4)', desc: 'Clipboard text' },
          { sig: 'stat(6)', desc: 'Current frame (increments each _update)' },
          { sig: 'printh(s)', desc: 'Print to host console (for debugging)' },
          { sig: 'extcmd("pause")', desc: 'Trigger system pause menu' },
        ],
      },
      {
        title: 'LUA SPECIFICS',
        entries: [
          { sig: '!=  same as  ~=', desc: 'Not-equal operator (both work in PICO-8)' },
          { sig: 'and / or / not', desc: 'Logical operators (no && || ! in Lua)' },
          { sig: 'local x = a or b', desc: 'Default value pattern (if a is nil/false, use b)' },
          { sig: 'if x then ... end', desc: 'Only nil and false are falsy. 0 is truthy!' },
          { sig: '?x  -- shorthand print', desc: '?expr is shorthand for print(tostr(expr)) — debug fast' },
        ],
      },
    ],
  },
  {
    id: 'map',
    label: '🗺️ Map',
    subtitle: '128×64 cells, each cell 8×8px sprite',
    cards: [
      {
        title: 'MAP FUNCTIONS',
        entries: [
          { sig: 'mget(cx,cy)', desc: 'Get sprite number at map cell cx,cy' },
          { sig: 'mset(cx,cy,n)', desc: 'Set map cell cx,cy to sprite n' },
          { sig: 'fget(n,[b])', desc: 'Get sprite flags. No b → all 8 flags as bitmask. b=bit index → bool' },
          { sig: 'fset(n,[b,]v)', desc: 'Set sprite flag. No b → v is bitmask for all flags' },
        ],
        tip: 'Use fget for collision: if fget(mget(cx,cy), 0) then -- solid!',
      },
      {
        title: 'TILEMAP COLLISION PATTERN',
        codeBlock: `-- check tile flag at world pos
function solid(x,y)
  local cx = flr(x/8)
  local cy = flr(y/8)
  return fget(mget(cx,cy), 0)
end`,
      },
    ],
  },
  {
    id: 'memory',
    label: '💾 Memory',
    subtitle: '64KB address space',
    cards: [
      {
        title: 'PEEK & POKE',
        entries: [
          { sig: 'peek(addr)', desc: 'Read byte at address (0-255)' },
          { sig: 'poke(addr,val)', desc: 'Write byte to address' },
          { sig: 'peek2(addr)', desc: 'Read 2-byte word' },
          { sig: 'poke2(addr,val)', desc: 'Write 2-byte word' },
          { sig: 'peek4(addr)', desc: 'Read 4-byte fixed-point number' },
          { sig: 'poke4(addr,val)', desc: 'Write 4-byte fixed-point' },
          { sig: 'memcpy(dst,src,len)', desc: 'Copy len bytes from src to dst' },
          { sig: 'memset(dst,val,len)', desc: 'Fill len bytes at dst with val' },
        ],
      },
      {
        title: 'MEMORY MAP',
        tableData: [
          ['0x0000–0x0FFF', 'Spritesheet (128×128 px)'],
          ['0x1000–0x1FFF', 'Map (upper 32 rows)'],
          ['0x2000–0x2FFF', 'Map (lower 32 rows) / shared with spritesheet bottom half'],
          ['0x3000–0x30FF', 'Sprite flags'],
          ['0x3100–0x31FF', 'Music patterns'],
          ['0x3200–0x42FF', 'SFX data'],
          ['0x4300–0x5DFF', 'General purpose RAM'],
          ['0x5E00–0x5EFF', 'Persistent cart data'],
          ['0x5F00–0x5FFF', 'Draw state / GPIO'],
          ['0x6000–0x7FFF', 'Screen buffer'],
        ],
      },
      {
        title: 'CART DATA (SAVE)',
        entries: [
          { sig: 'cartdata(id)', desc: 'Init persistent storage with unique cart id string. Call once in _init' },
          { sig: 'dget(i)', desc: 'Get persistent value at index i (0-63)' },
          { sig: 'dset(i,v)', desc: 'Set persistent value at index i. Auto-saved!' },
        ],
      },
    ],
  },
  {
    id: 'palette',
    label: '🎨 Palette',
    subtitle: '16-Color Palette — Plus 16 secret colors (via pal)',
    cards: [],
  },
  {
    id: 'structure',
    label: '🏗️ Structure',
    subtitle: 'OOP, state machines, patterns',
    cards: [
      {
        title: 'OOP WITH METATABLES',
        codeBlock: `-- define a class
player = {}
player.__index = player

function player:new(x,y)
  local o = {x=x, y=y, spd=2}
  return setmetatable(o, player)
end

function player:update()
  if btn(0) then self.x -= self.spd end
end

-- usage
local p = player:new(64,64)
p:update()`,
      },
      {
        title: 'SIMPLE STATE MACHINE',
        codeBlock: `state = "menu"
states = {}

states.menu = function()
  print("press x", 50, 60, 7)
  if btnp(5) then state="game" end
end

states.game = function() ... end

function _update()
  states[state]()
end`,
      },
      {
        title: 'LIMITS TO KNOW',
        tableData: [
          ['Screen', '128 × 128 px'],
          ['Sprites', '256 (8×8 px each)'],
          ['Map', '128 × 64 cells'],
          ['SFX', '64 slots, 32 notes each'],
          ['Music', '64 patterns'],
          ['Colors', '16 (+ 16 secret)'],
          ['Token limit', '8192 tokens'],
          ['Char limit', '32768 characters'],
          ['RAM', '64KB'],
          ['FPS', '30 (_update) or 60 (_update60)'],
        ],
        tip: 'Token savers: Use ? for print, a+=1 not a=a+1, shorthand if on one line.',
      },
      {
        title: 'COROUTINES',
        codeBlock: `-- cutscene / tween example
function sequence()
  move_to(p, 64, 32)
  yield()  -- wait a frame
  say(p, "hello!")
end

co = cocreate(sequence)
-- in _update:
if costatus(co)!="dead" then
  coresume(co)
end`,
        entries: [
          { sig: 'cocreate(f)', desc: 'Create coroutine from function' },
          { sig: 'coresume(co,[...])', desc: 'Resume coroutine' },
          { sig: 'costatus(co)', desc: '"running" / "suspended" / "dead"' },
          { sig: 'yield([...])', desc: 'Suspend coroutine (call from inside)' },
        ],
      },
    ],
  },
]

const STANDARD_PALETTE = [
  { i: 0,  hex: '#000000', name: 'black' },
  { i: 1,  hex: '#1d2b53', name: 'dark-blue' },
  { i: 2,  hex: '#7e2553', name: 'dark-purple' },
  { i: 3,  hex: '#008751', name: 'dark-green' },
  { i: 4,  hex: '#ab5236', name: 'brown' },
  { i: 5,  hex: '#5f574f', name: 'dark-grey' },
  { i: 6,  hex: '#c2c3c7', name: 'light-grey' },
  { i: 7,  hex: '#fff1e8', name: 'white' },
  { i: 8,  hex: '#ff004d', name: 'red' },
  { i: 9,  hex: '#ffa300', name: 'orange' },
  { i: 10, hex: '#ffec27', name: 'yellow' },
  { i: 11, hex: '#00e436', name: 'green' },
  { i: 12, hex: '#29adff', name: 'blue' },
  { i: 13, hex: '#83769c', name: 'lavender' },
  { i: 14, hex: '#ff77a8', name: 'pink' },
  { i: 15, hex: '#ffccaa', name: 'peach' },
]

const SECRET_PALETTE = [
  { i: 128, hex: '#291814', name: 'black-2' },
  { i: 129, hex: '#111d35', name: 'storm' },
  { i: 130, hex: '#1d2b53', name: 'wine' },
  { i: 131, hex: '#234309', name: 'moss' },
  { i: 132, hex: '#4a4a4a', name: 'tan' },
  { i: 133, hex: '#6d5443', name: 'slate' },
  { i: 134, hex: '#a28879', name: 'silver' },
  { i: 135, hex: '#f5c5b0', name: 'mauve' },
  { i: 136, hex: '#ff7171', name: 'rose' },
  { i: 137, hex: '#ffd9a0', name: 'ember' },
  { i: 138, hex: '#fff7a8', name: 'lemon' },
  { i: 139, hex: '#a8f7a0', name: 'lime' },
  { i: 140, hex: '#a0e8ff', name: 'sky' },
  { i: 141, hex: '#d8c4ff', name: 'dusk' },
  { i: 142, hex: '#ffc4d8', name: 'blush' },
  { i: 143, hex: '#ffe8c4', name: 'bisque' },
]

export default function Pico8Snippets() {
  const [activeTab, setActiveTab] = useState('graphics')
  const [search, setSearch] = useState('')

  const currentTab = TABS.find((t) => t.id === activeTab)!

  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    const results: { tab: Pico8Tab; card: RefCard }[] = []
    for (const tab of TABS) {
      for (const card of tab.cards) {
        const text = [
          card.title,
          ...(card.entries?.map((e) => `${e.sig} ${e.desc ?? ''}`) ?? []),
          ...(card.tableData?.map((r) => r.join(' ')) ?? []),
          card.codeBlock ?? '',
          card.tip ?? '',
        ]
          .join(' ')
          .toLowerCase()
        if (text.includes(q)) {
          results.push({ tab, card })
        }
      }
    }
    return results
  }, [search])

  return (
    <div className="space-y-4">
      <input
        className="tool-input"
        placeholder="Search functions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {!search.trim() && (
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-2.5 py-1 rounded text-xs font-mono border transition-colors',
                activeTab === tab.id
                  ? 'bg-accent text-bg-base border-accent'
                  : 'border-bg-border text-muted hover:text-text-primary hover:border-text-secondary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {search.trim() ? (
        searchResults!.length === 0 ? (
          <p className="text-sm font-mono text-muted py-8 text-center">no results found</p>
        ) : (
          <div className="space-y-3">
            {searchResults!.map(({ tab, card }, i) => (
              <div key={i}>
                <p className="text-xs font-mono text-muted mb-1.5 px-1">{tab.label}</p>
                <RefCardView card={card} />
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'palette' ? (
        <PaletteView />
      ) : (
        <div>
          <p className="text-xs font-mono text-muted mb-3">{currentTab.subtitle}</p>
          <div className="space-y-3">
            {currentTab.cards.map((card, i) => (
              <RefCardView key={i} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RefCardView({ card }: { card: RefCard }) {
  return (
    <div className="tool-section">
      <p className="text-xs font-mono font-semibold text-accent mb-2">{card.title}</p>

      {card.codeBlock && (
        <pre className="bg-bg-base rounded border border-bg-border p-3 text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre leading-relaxed mb-2">
          {card.codeBlock}
        </pre>
      )}

      {card.entries && card.entries.length > 0 && (
        <div className="space-y-0">
          {card.entries.map((entry, i) => (
            <div key={i} className={clsx('py-1.5', i > 0 && 'border-t border-bg-border')}>
              <code className="text-xs font-mono text-text-primary">{entry.sig}</code>
              {entry.desc && (
                <p className="text-xs font-mono text-muted mt-0.5 pl-2">{entry.desc}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {card.tableData && (
        <table className="w-full text-xs font-mono">
          <tbody>
            {card.tableData.map(([key, val], i) => (
              <tr key={i} className={clsx(i > 0 && 'border-t border-bg-border')}>
                <td className="py-1 pr-3 text-text-primary whitespace-nowrap w-2/5">{key}</td>
                <td className="py-1 text-muted">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {card.tip && (
        <div className="mt-2 rounded border border-bg-border bg-bg-elevated p-2 text-xs font-mono text-text-secondary">
          <span className="text-accent font-semibold">TIP: </span>
          {card.tip}
        </div>
      )}
    </div>
  )
}

function PaletteView() {
  return (
    <div className="space-y-4">
      <div className="tool-section">
        <p className="text-xs font-mono font-semibold text-accent mb-3">STANDARD PALETTE (0-15)</p>
        <div className="grid grid-cols-8 gap-2">
          {STANDARD_PALETTE.map((c) => (
            <div
              key={c.i}
              title={`${c.i}: ${c.name} (${c.hex})`}
              className="aspect-square rounded flex flex-col items-center justify-center gap-0.5 border border-white/10 cursor-default"
              style={{ background: c.hex }}
            >
              <span className="text-white text-xs font-mono leading-none" style={{ textShadow: '1px 1px 0 #000' }}>
                {c.i}
              </span>
              <span
                className="text-white font-mono text-center leading-none px-0.5"
                style={{ fontSize: '7px', textShadow: '1px 1px 0 #000', opacity: 0.85 }}
              >
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="tool-section">
        <p className="text-xs font-mono font-semibold text-accent mb-1">SECRET PALETTE (128-143)</p>
        <p className="text-xs font-mono text-muted mb-3">Access via pal(c, 128+n, 1)</p>
        <div className="grid grid-cols-8 gap-2">
          {SECRET_PALETTE.map((c) => (
            <div
              key={c.i}
              title={`${c.i}: ${c.name} (${c.hex})`}
              className="aspect-square rounded flex flex-col items-center justify-center gap-0.5 border border-white/10 cursor-default"
              style={{ background: c.hex }}
            >
              <span className="text-white text-xs font-mono leading-none" style={{ textShadow: '1px 1px 0 #000' }}>
                {c.i}
              </span>
              <span
                className="text-white font-mono text-center leading-none px-0.5"
                style={{ fontSize: '7px', textShadow: '1px 1px 0 #000', opacity: 0.85 }}
              >
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
