// Tool: Mermaid Diagram Snippets
// Searchable, copyable diagram templates for Mermaid.js

import { useState } from 'react'
import clsx from 'clsx'

interface Snippet {
  id: string
  title: string
  description: string
  code: string
  category: SnippetCategory
}

type SnippetCategory = 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt' | 'misc'

const CATEGORY_LABELS: Record<SnippetCategory, string> = {
  flowchart: 'Flowchart',
  sequence: 'Sequence',
  class: 'Class',
  state: 'State',
  er: 'ER',
  gantt: 'Gantt',
  misc: 'Misc',
}

const SNIPPETS: Snippet[] = [
  // Flowchart
  {
    id: 'flow-basic',
    title: 'Flowchart — Top Down',
    description: 'Basic top-down flow with a decision branch',
    category: 'flowchart',
    code: `flowchart TD
    A[Start] --> B{Decision?}
    B -- Yes --> C[Do thing]
    B -- No  --> D[Do other thing]
    C --> E[End]
    D --> E`,
  },
  {
    id: 'flow-lr',
    title: 'Flowchart — Left to Right',
    description: 'Horizontal flow with labeled edges',
    category: 'flowchart',
    code: `flowchart LR
    A([Start]) --> B[Process]
    B --> C{Valid?}
    C -- yes --> D[/Output/]
    C -- no  --> E[Handle error]
    E --> B`,
  },
  {
    id: 'flow-subgraph',
    title: 'Flowchart with Subgraphs',
    description: 'Group nodes into labeled clusters',
    category: 'flowchart',
    code: `flowchart TD
    subgraph DB[Data Layer]
        A[(Database)]
        B[(Cache)]
    end
    subgraph API[API Layer]
        C[Controller]
        D{Auth?}
    end
    C --> D
    D -- ok  --> A
    D -- fail --> E[401]
    A --> B`,
  },

  // Sequence
  {
    id: 'seq-basic',
    title: 'Sequence — Request / Response',
    description: 'Client → Server → DB with return messages',
    category: 'sequence',
    code: `sequenceDiagram
    participant C as Client
    participant S as Server
    participant D as Database

    C->>S: POST /login
    S->>D: SELECT user WHERE email=?
    D-->>S: user row
    S-->>C: 200 { token }`,
  },
  {
    id: 'seq-activation',
    title: 'Sequence — Activation Boxes',
    description: 'Show call stack with +/- activation notation',
    category: 'sequence',
    code: `sequenceDiagram
    Alice->>+Bob: Hey Bob!
    Bob->>+Alice: Hey Alice!
    Bob->>-Alice: I am good, thanks.
    Alice->>-Bob: Great!
    Note over Alice,Bob: Short conversation`,
  },
  {
    id: 'seq-loop',
    title: 'Sequence — Loop & Alt',
    description: 'Conditional and loop blocks',
    category: 'sequence',
    code: `sequenceDiagram
    Client->>Server: GET /stream

    loop Every second
        Server-->>Client: data chunk
    end

    alt Success
        Server-->>Client: 200 OK
    else Timeout
        Server-->>Client: 408 Timeout
    end`,
  },

  // Class
  {
    id: 'class-basic',
    title: 'Class Diagram — Inheritance',
    description: 'Base class with two subclasses',
    category: 'class',
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() void
    }
    class Dog {
        +String breed
        +fetch() void
    }
    class Cat {
        +bool indoor
        +purr() void
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  {
    id: 'class-relations',
    title: 'Class Diagram — Relationships',
    description: 'Composition, aggregation, and association',
    category: 'class',
    code: `classDiagram
    class Order {
        +int id
        +Date createdAt
        +calculateTotal() float
    }
    class OrderItem {
        +int quantity
        +float price
    }
    class Product {
        +String name
        +float unitPrice
    }
    class Customer {
        +String email
        +placeOrder() Order
    }

    Order "1" *-- "1..*" OrderItem : contains
    OrderItem --> Product : references
    Customer "1" --> "0..*" Order : places`,
  },

  // State
  {
    id: 'state-basic',
    title: 'State Diagram — Game States',
    description: 'Transitions between game states',
    category: 'state',
    code: `stateDiagram-v2
    [*] --> Idle

    Idle --> Loading : fetch()
    Loading --> Ready  : data received
    Loading --> Error  : request failed
    Ready  --> Idle    : reset()
    Error  --> Idle    : retry()
    Ready  --> [*]`,
  },
  {
    id: 'state-nested',
    title: 'State Diagram — Nested States',
    description: 'Composite states with nested transitions',
    category: 'state',
    code: `stateDiagram-v2
    [*] --> Menu

    state Menu {
        [*] --> MainMenu
        MainMenu --> Settings : open settings
        Settings --> MainMenu : back
    }

    Menu --> Playing : start game
    Playing --> Menu  : pause / quit

    state Playing {
        [*] --> Alive
        Alive --> Dead : take damage
        Dead --> [*]
    }`,
  },

  // ER
  {
    id: 'er-basic',
    title: 'ER Diagram — Blog Schema',
    description: 'Users, posts, and comments with relationships',
    category: 'er',
    code: `erDiagram
    USER {
        int id PK
        string email
        string name
    }
    POST {
        int id PK
        string title
        text content
        int userId FK
    }
    COMMENT {
        int id PK
        text body
        int postId FK
        int userId FK
    }

    USER    ||--o{ POST    : "writes"
    POST    ||--o{ COMMENT : "has"
    USER    ||--o{ COMMENT : "leaves"`,
  },

  // Gantt
  {
    id: 'gantt-basic',
    title: 'Gantt Chart — Project Timeline',
    description: 'Phased project with dependencies',
    category: 'gantt',
    code: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD

    section Planning
    Requirements    :done,  p1, 2024-01-01, 2024-01-07
    Design          :done,  p2, 2024-01-08, 7d

    section Development
    Frontend        :active, d1, 2024-01-15, 14d
    Backend         :        d2, 2024-01-15, 21d

    section Testing
    QA              :        t1, after d1, 7d
    UAT             :        t2, after d2, 5d`,
  },

  // Misc
  {
    id: 'misc-pie',
    title: 'Pie Chart',
    description: 'Simple percentage breakdown',
    category: 'misc',
    code: `pie title Browser Market Share
    "Chrome"  : 65
    "Safari"  : 19
    "Firefox" : 4
    "Edge"    : 4
    "Other"   : 8`,
  },
  {
    id: 'misc-git',
    title: 'Git Graph',
    description: 'Branch, commit, and merge visualization',
    category: 'misc',
    code: `gitGraph
    commit id: "initial"
    branch feature/login
    checkout feature/login
    commit id: "add login form"
    commit id: "add auth API"
    checkout main
    merge feature/login id: "merge login"
    commit id: "bump version"`,
  },
  {
    id: 'misc-mindmap',
    title: 'Mind Map',
    description: 'Hierarchical topic breakdown',
    category: 'misc',
    code: `mindmap
  root((Project))
    Frontend
      React
      TypeScript
      Tailwind
    Backend
      Node.js
      PostgreSQL
    DevOps
      Docker
      CI/CD`,
  },
  {
    id: 'misc-timeline',
    title: 'Timeline',
    description: 'Chronological event sequence',
    category: 'misc',
    code: `timeline
    title History of Social Media
    2004 : Facebook
    2006 : Twitter
    2010 : Instagram
    2011 : Snapchat
    2016 : TikTok`,
  },
  {
    id: 'misc-xychart',
    title: 'XY Chart — Bar',
    description: 'Simple bar chart with monthly data',
    category: 'misc',
    code: `xychart-beta
    title "Monthly Revenue"
    x-axis [Jan, Feb, Mar, Apr, May, Jun]
    y-axis "Revenue ($k)" 0 --> 120
    bar  [42, 58, 73, 65, 91, 110]
    line [42, 58, 73, 65, 91, 110]`,
  },
]

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as SnippetCategory[]

export default function MermaidSnippets() {
  const [activeCategory, setActiveCategory] = useState<SnippetCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = SNIPPETS.filter((s) => {
    const matchCategory = activeCategory === 'all' || s.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch =
      q === '' ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    return matchCategory && matchSearch
  })

  const copy = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.code)
    setCopiedId(snippet.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="space-y-5">
      <input
        className="tool-input"
        placeholder="Search diagrams..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-1.5">
        <CategoryTab label="All" active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
        {ALL_CATEGORIES.map((cat) => (
          <CategoryTab
            key={cat}
            label={CATEGORY_LABELS[cat]}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm font-mono text-muted py-8 text-center">no snippets found</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((snippet) => (
            <div key={snippet.id} className="tool-section">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{snippet.title}</p>
                  <p className="text-xs font-mono text-muted mt-0.5">{snippet.description}</p>
                </div>
                <button className="tool-btn-ghost shrink-0 text-xs" onClick={() => copy(snippet)}>
                  {copiedId === snippet.id ? '✓' : 'copy'}
                </button>
              </div>
              <pre className="bg-bg-base rounded border border-bg-border p-3 text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre leading-relaxed mt-2">
                {snippet.code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-2.5 py-1 rounded text-xs font-mono border transition-colors',
        active
          ? 'bg-accent text-bg-base border-accent'
          : 'border-bg-border text-muted hover:text-text-primary hover:border-text-secondary'
      )}
    >
      {label}
    </button>
  )
}
