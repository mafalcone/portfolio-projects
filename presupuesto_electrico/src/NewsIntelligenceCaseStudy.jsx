const flow = [
  { title: 'Input', text: 'Configured RSS / JSON APIs / authenticated inbound webhook' },
  { title: 'Normalize', text: 'Strict schema validation, size limits and stable fingerprints' },
  { title: 'Analyze', text: 'Structured analysis provider with deterministic fallback' },
  { title: 'Persist', text: 'SQLite records for articles, analyses, runs and deliveries' },
  { title: 'Deliver', text: 'REST API, dashboard, JSONL logs and signed outbound webhook' }
]

const stack = [
  'Python 3.12',
  'REST API',
  'Pydantic',
  'SQLite / SQL',
  'JSON Schema',
  'RSS / JSON',
  'Webhooks / HMAC',
  'Structured logging'
]

export function NewsIntelligenceCaseStudy() {
  return <article className="news-case-study">
    <header className="news-case-hero">
      <div>
        <div className="case-status-row"><span className="case-status">MVP VALIDATED</span><span>Applied AI / Automation / API Integration</span></div>
        <h2>AI News Intelligence Pipeline</h2>
        <p>A private automation pipeline that turns heterogeneous news inputs into validated, searchable and routable intelligence while keeping ingestion, analysis and delivery independently observable.</p>
      </div>
      <div className="private-access"><strong>Private implementation</strong><span>Technical demo available on request.</span></div>
    </header>

    <section className="case-metrics" aria-label="Validated sanitized demo metrics">
      <div><span>Sanitized items</span><strong>3 / 3</strong><small>ingested and analyzed</small></div>
      <div><span>Repeat run</span><strong>3</strong><small>duplicates skipped</small></div>
      <div><span>Pipeline failures</span><strong>0</strong><small>in validated demo</small></div>
      <div><span>Automated tests</span><strong>4 / 4</strong><small>passing</small></div>
    </section>

    <section className="case-flow" aria-label="AI News Intelligence Pipeline data flow">
      {flow.map((item, index) => <div className="flow-step" key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}
    </section>

    <section className="case-detail-grid">
      <div className="case-detail">
        <span>Problem</span>
        <h3>Raw news is repetitive and inconsistent</h3>
        <p>The pipeline creates a dependable path from unstructured items to schema-validated records without tying the workflow to one provider or publishing channel.</p>
      </div>
      <div className="case-detail">
        <span>Reliability</span>
        <h3>Failure domains stay separate</h3>
        <p>Unique database constraints enforce idempotency. Bounded retry handles transient calls, deterministic fallback keeps analysis available, and delivery failure never erases stored results.</p>
      </div>
      <div className="case-detail">
        <span>AI and cost control</span>
        <h3>Structured output, local validation and measurable usage</h3>
        <p>The provider adapter uses a strict JSON schema, validates the response again, records tokens and estimated cost, and avoids model calls for duplicate items. A zero-cost local mode makes the demo reproducible.</p>
      </div>
      <div className="case-detail">
        <span>Current result</span>
        <h3>Runnable API and operational dashboard</h3>
        <p>The MVP exposes health, status, article and run endpoints plus an authenticated ingestion webhook. The UI shows provider, relevance, recent runs, failures and aggregate AI usage using sanitized data.</p>
      </div>
    </section>

    <footer className="case-footer">
      <div><span>Verified stack</span><div className="case-stack">{stack.map(item => <b key={item}>{item}</b>)}</div></div>
      <p><strong>Disclosure:</strong> the provider adapter is implemented; this cloud validation used the deterministic fallback because no paid API credential was supplied.</p>
    </footer>
  </article>
}

