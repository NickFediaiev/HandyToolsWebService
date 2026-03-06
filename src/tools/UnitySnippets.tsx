// Tool: Unity C# Snippets
// Categorized, searchable reference snippets for common Unity patterns

import { useState } from 'react'
import clsx from 'clsx'

interface Snippet {
  id: string
  title: string
  description: string
  code: string
  category: SnippetCategory
}

type SnippetCategory = 'monobehaviour' | 'physics' | 'coroutines' | 'events' | 'ui' | 'utilities'

const CATEGORY_LABELS: Record<SnippetCategory, string> = {
  monobehaviour: 'MonoBehaviour',
  physics: 'Physics',
  coroutines: 'Coroutines',
  events: 'Events',
  ui: 'UI',
  utilities: 'Utilities',
}

const SNIPPETS: Snippet[] = [
  // MonoBehaviour
  {
    id: 'mb-template',
    title: 'MonoBehaviour Template',
    description: 'Full lifecycle with the most common hooks',
    category: 'monobehaviour',
    code: `using UnityEngine;

public class MyComponent : MonoBehaviour
{
    void Awake()
    {
        // Called once before Start — use for internal init & caching references
    }

    void OnEnable()
    {
        // Called every time the object is activated
    }

    void Start()
    {
        // Called once on the first frame the object is active
    }

    void Update()
    {
        // Called every frame
    }

    void FixedUpdate()
    {
        // Called at a fixed physics timestep — use for Rigidbody logic
    }

    void LateUpdate()
    {
        // Called after all Update calls — use for camera follow
    }

    void OnDisable()
    {
        // Called every time the object is deactivated
    }

    void OnDestroy()
    {
        // Called when the object is destroyed — unsubscribe events here
    }
}`,
  },
  {
    id: 'mb-singleton',
    title: 'Singleton MonoBehaviour',
    description: 'Thread-safe singleton with DontDestroyOnLoad',
    category: 'monobehaviour',
    code: `using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }
}`,
  },
  {
    id: 'mb-scriptableobject',
    title: 'ScriptableObject Template',
    description: 'Data asset you can create from the Project window',
    category: 'monobehaviour',
    code: `using UnityEngine;

[CreateAssetMenu(fileName = "NewData", menuName = "MyGame/Data")]
public class MyData : ScriptableObject
{
    [SerializeField] private float _speed = 5f;
    [SerializeField] private int _health = 100;

    public float Speed => _speed;
    public int Health => _health;
}`,
  },

  // Physics
  {
    id: 'phy-raycast',
    title: 'Raycast from Camera',
    description: 'Screen-to-world ray from the mouse position',
    category: 'physics',
    code: `void Update()
{
    if (Input.GetMouseButtonDown(0))
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        if (Physics.Raycast(ray, out RaycastHit hit, 100f))
        {
            Debug.Log($"Hit: {hit.collider.name} at {hit.point}");
        }
    }
}`,
  },
  {
    id: 'phy-overlapsphere',
    title: 'OverlapSphere',
    description: 'Detect all colliders within a radius',
    category: 'physics',
    code: `void DetectNearby()
{
    float radius = 5f;
    LayerMask mask = LayerMask.GetMask("Enemy");
    Collider[] hits = Physics.OverlapSphere(transform.position, radius, mask);

    foreach (Collider hit in hits)
    {
        Debug.Log($"Found: {hit.name}");
    }
}`,
  },
  {
    id: 'phy-collision',
    title: 'Collision & Trigger Callbacks',
    description: 'OnCollisionEnter and OnTriggerEnter with tag check',
    category: 'physics',
    code: `// Requires a non-kinematic Rigidbody
void OnCollisionEnter(Collision collision)
{
    if (collision.gameObject.CompareTag("Enemy"))
    {
        Debug.Log("Collided with enemy");
    }
}

// Requires a trigger collider (Is Trigger = true)
void OnTriggerEnter(Collider other)
{
    if (other.CompareTag("Pickup"))
    {
        Destroy(other.gameObject);
    }
}`,
  },
  {
    id: 'phy-movetowards',
    title: 'Move & Rotate Towards Target',
    description: 'Frame-rate independent movement and rotation',
    category: 'physics',
    code: `[SerializeField] private Transform _target;
[SerializeField] private float _speed = 3f;
[SerializeField] private float _rotateSpeed = 120f;

void Update()
{
    // Move towards target
    transform.position = Vector3.MoveTowards(
        transform.position, _target.position, _speed * Time.deltaTime);

    // Rotate towards target
    Vector3 dir = (_target.position - transform.position).normalized;
    if (dir != Vector3.zero)
    {
        Quaternion targetRot = Quaternion.LookRotation(dir);
        transform.rotation = Quaternion.RotateTowards(
            transform.rotation, targetRot, _rotateSpeed * Time.deltaTime);
    }
}`,
  },

  // Coroutines
  {
    id: 'co-wait-seconds',
    title: 'Wait for Seconds',
    description: 'Delay execution inside a coroutine',
    category: 'coroutines',
    code: `void Start()
{
    StartCoroutine(DelayedAction(2f));
}

IEnumerator DelayedAction(float delay)
{
    yield return new WaitForSeconds(delay);
    Debug.Log("Ran after delay");
}`,
  },
  {
    id: 'co-wait-frame',
    title: 'Wait for End of Frame',
    description: 'Defer logic to the end of the current frame',
    category: 'coroutines',
    code: `IEnumerator RunAtEndOfFrame()
{
    yield return new WaitForEndOfFrame();
    // Runs after rendering — useful for screenshots or UI layout reads
    Debug.Log("End of frame");
}`,
  },
  {
    id: 'co-wait-condition',
    title: 'Wait Until Condition',
    description: 'Pause a coroutine until a predicate is true',
    category: 'coroutines',
    code: `bool _isReady = false;

IEnumerator WaitForReady()
{
    yield return new WaitUntil(() => _isReady);
    Debug.Log("Ready!");
}`,
  },
  {
    id: 'co-fade',
    title: 'Fade CanvasGroup',
    description: 'Smoothly fade a CanvasGroup in or out',
    category: 'coroutines',
    code: `IEnumerator Fade(CanvasGroup group, float from, float to, float duration)
{
    float elapsed = 0f;
    group.alpha = from;

    while (elapsed < duration)
    {
        elapsed += Time.deltaTime;
        group.alpha = Mathf.Lerp(from, to, elapsed / duration);
        yield return null;
    }

    group.alpha = to;
}

// Usage:
// StartCoroutine(Fade(canvasGroup, 0f, 1f, 0.5f));`,
  },

  // Events
  {
    id: 'ev-unityevent',
    title: 'UnityEvent Field',
    description: 'Inspector-wired event — no code subscription needed',
    category: 'events',
    code: `using UnityEngine;
using UnityEngine.Events;

public class Button : MonoBehaviour
{
    [SerializeField] private UnityEvent _onClick;

    void OnMouseDown()
    {
        _onClick?.Invoke();
    }
}`,
  },
  {
    id: 'ev-csharp-action',
    title: 'C# Action Event',
    description: 'Lightweight event with no Unity overhead',
    category: 'events',
    code: `using System;
using UnityEngine;

public class PlayerHealth : MonoBehaviour
{
    public event Action<int> OnHealthChanged;
    public event Action OnDied;

    private int _health = 100;

    public void TakeDamage(int amount)
    {
        _health -= amount;
        OnHealthChanged?.Invoke(_health);

        if (_health <= 0)
            OnDied?.Invoke();
    }
}

// Subscribe:
// player.OnHealthChanged += UpdateUI;
// player.OnDied += ShowGameOver;

// Always unsubscribe in OnDestroy:
// player.OnHealthChanged -= UpdateUI;`,
  },
  {
    id: 'ev-static-bus',
    title: 'Static Event Bus',
    description: 'Decoupled event system — no direct references needed',
    category: 'events',
    code: `using System;

public static class EventBus
{
    public static event Action<int> OnScoreChanged;
    public static event Action OnGameOver;

    public static void ScoreChanged(int score) => OnScoreChanged?.Invoke(score);
    public static void GameOver() => OnGameOver?.Invoke();
}

// Publisher:
// EventBus.ScoreChanged(100);

// Subscriber (in MonoBehaviour):
// void OnEnable()  => EventBus.OnScoreChanged += HandleScore;
// void OnDisable() => EventBus.OnScoreChanged -= HandleScore;`,
  },

  // UI
  {
    id: 'ui-tmp',
    title: 'TextMeshPro Reference',
    description: 'Get and set TMP text at runtime',
    category: 'ui',
    code: `using TMPro;
using UnityEngine;

public class ScoreDisplay : MonoBehaviour
{
    [SerializeField] private TMP_Text _label;

    public void SetScore(int score)
    {
        _label.text = $"Score: {score}";
    }
}`,
  },
  {
    id: 'ui-button',
    title: 'Button Click in Code',
    description: 'Subscribe to a Button click without the Inspector',
    category: 'ui',
    code: `using UnityEngine;
using UnityEngine.UI;

public class MenuController : MonoBehaviour
{
    [SerializeField] private Button _playButton;

    void OnEnable()
    {
        _playButton.onClick.AddListener(OnPlayClicked);
    }

    void OnDisable()
    {
        _playButton.onClick.RemoveListener(OnPlayClicked);
    }

    void OnPlayClicked()
    {
        Debug.Log("Play clicked");
    }
}`,
  },
  {
    id: 'ui-safezone',
    title: 'Safe Area Rect',
    description: 'Apply device safe area (notch / home bar) to a RectTransform',
    category: 'ui',
    code: `using UnityEngine;

[RequireComponent(typeof(RectTransform))]
public class SafeAreaPanel : MonoBehaviour
{
    void Awake() => Apply();

    void Apply()
    {
        Rect safeArea = Screen.safeArea;
        RectTransform rt = GetComponent<RectTransform>();
        Vector2 screenSize = new Vector2(Screen.width, Screen.height);

        Vector2 anchorMin = safeArea.position / screenSize;
        Vector2 anchorMax = (safeArea.position + safeArea.size) / screenSize;

        rt.anchorMin = anchorMin;
        rt.anchorMax = anchorMax;
    }
}`,
  },

  // Utilities
  {
    id: 'util-getorcreate',
    title: 'GetOrAddComponent<T>',
    description: 'Extension method to get a component or add it if missing',
    category: 'utilities',
    code: `using UnityEngine;

public static class GameObjectExtensions
{
    public static T GetOrAddComponent<T>(this GameObject go) where T : Component
    {
        return go.TryGetComponent(out T existing) ? existing : go.AddComponent<T>();
    }
}

// Usage:
// Rigidbody rb = gameObject.GetOrAddComponent<Rigidbody>();`,
  },
  {
    id: 'util-debug-color',
    title: 'Colored Debug.Log',
    description: 'Log with rich-text color tagging',
    category: 'utilities',
    code: `using UnityEngine;

public static class DebugExtensions
{
    public static void LogColor(string message, string hexColor = "#00FF88")
    {
        Debug.Log($"<color={hexColor}>{message}</color>");
    }
}

// Usage:
// DebugExtensions.LogColor("Player spawned", "#FF4444");`,
  },
  {
    id: 'util-timer',
    title: 'Simple Cooldown Timer',
    description: 'Frame-rate independent cooldown using Time.time',
    category: 'utilities',
    code: `float _cooldown = 1.5f;
float _nextFireTime = 0f;

void Update()
{
    if (Input.GetKeyDown(KeyCode.Space) && Time.time >= _nextFireTime)
    {
        _nextFireTime = Time.time + _cooldown;
        Fire();
    }
}`,
  },
  {
    id: 'util-smoothdamp',
    title: 'SmoothDamp Camera Follow',
    description: 'Smooth camera that follows a target with velocity dampening',
    category: 'utilities',
    code: `[SerializeField] private Transform _target;
[SerializeField] private float _smoothTime = 0.15f;
[SerializeField] private Vector3 _offset = new Vector3(0, 2, -5);

private Vector3 _velocity;

void LateUpdate()
{
    Vector3 desiredPos = _target.position + _offset;
    transform.position = Vector3.SmoothDamp(
        transform.position, desiredPos, ref _velocity, _smoothTime);
}`,
  },
  {
    id: 'util-scene-load',
    title: 'Load Scene Async',
    description: 'Async scene load with progress callback',
    category: 'utilities',
    code: `using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;

IEnumerator LoadSceneAsync(string sceneName, System.Action<float> onProgress = null)
{
    AsyncOperation op = SceneManager.LoadSceneAsync(sceneName);
    op.allowSceneActivation = false;

    while (op.progress < 0.9f)
    {
        onProgress?.Invoke(op.progress);
        yield return null;
    }

    onProgress?.Invoke(1f);
    op.allowSceneActivation = true;
}`,
  },
]

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as SnippetCategory[]

export default function UnitySnippets() {
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
      {/* Search */}
      <input
        className="tool-input"
        placeholder="Search snippets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Category tabs */}
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

      {/* Snippets */}
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
                <button
                  className="tool-btn-ghost shrink-0 text-xs"
                  onClick={() => copy(snippet)}
                >
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
