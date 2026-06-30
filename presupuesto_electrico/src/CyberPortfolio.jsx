import React, { useState } from 'react'

const projectCards = [
  ['taskpulse', 'TaskPulse', 'Task management system with dashboard and task flow.', 'React · Vite · LocalStorage', 'blue', '☑'],
  ['logs', 'Incident Log Triage', 'Parse logs and classify events by type and severity.', 'Regex · JS · Heuristics', 'green', '▦'],
  ['site', 'Web Hardening Review', 'Review public web response signals.', 'Node.js · API · Report', 'purple', '◇'],
  ['estimate', 'Service Estimate', 'Create service quotes and export PDF.', 'React · jsPDF · LocalStorage', 'orange', '▣'],
  ['nutrition', 'Nutrition Analyzer', 'Search nutrition facts for foods.', 'Data lookup · React', 'blue', '♢']
]

const strengths = [
  ['Infrastructure', 'Servers, Networks, Virtualization, Backups', 'blue', '▤'],
  ['Support N2 / N3', 'Troubleshooting, Incidents, Users', 'green', '◖'],
  ['Automation', 'Scripts, APIs, Workflows, Task Automation', 'purple', '⚙'],
  ['Security / DevSecOps', 'Hardening, Monitoring, Logs, Best Practices', 'orange', '▣']
]

export default function CyberPortfolio() {
  const [active, setActive] = useState('site')

  return <main className="cyber-page">
    <header className="topbar">
      <div className="brand">
        <div className="logo-mark"><span>M</span><i>F</i></div>
        <div><strong>Manuel Falcone</strong><p>IT Professional | Infrastructure | Support | Automation | Security</p></div>
      </div>
      <nav className="nav-links"><a className="active" href="#projects">Projects</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#experience">Experience</a><a href="mailto:manu.axl@hotmail.com">Contact</a><a className="github-dot" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">●</a></nav>
    </header>

    <section className="hero-dashboard" id="about">
      <div className="portrait-card"><img src="https://github.com/mafalcone.png" alt="Manuel Falcone" /><div className="portrait-fallback">MF</div></div>
      <div className="hero-copy"><p className="hello">Hello, I'm</p><h1>MANUEL FALCONE</h1><h2>IT Infrastructure &amp; Support Specialist | Automation Builder | Security Enthusiast</h2><p className="lead">I design, build and maintain reliable systems and tools that solve real problems. Focused on infrastructure, automation and security with a strong support background (N1 / N2 / N3).</p><div className="cta-row"><a className="btn-primary" href="#projects">View Projects <span>→</span></a><a className="btn-ghost" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">Repository <span>↧</span></a></div></div>
      <aside className="strengths-panel" id="skills"><div className="panel-title"><span>◇</span><h2>Core Strengths</h2></div><div className="strength-grid">{strengths.map(([title, text, color, icon]) => <div className={`strength-card ${color}`} key={title}><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></aside>
    </section>

    <section className="featured" id="projects"><div className="section-title"><span>&lt;/&gt;</span><h2>Featured Projects</h2></div><div className="feature-grid">{projectCards.map(([id, title, desc, stack, color, icon]) => <button className={`feature-card ${color} ${active === id ? 'active' : ''}`} key={id} onClick={() => setActive(id)}><span className="feature-icon">{icon}</span><div><div className="feature-title-row"><h3>{title}</h3>{['taskpulse','logs','site'].includes(id) && <b className={`badge ${color}`}>NEW</b>}</div><p>{desc}</p><small>{stack}</small><em>Open Project →</em></div></button>)}</div></section>

    <section className={`active-project-panel ${active}`}>
      <div className="hardening-layout"><div className="tool-left"><div className="tool-heading"><span className="tool-icon purple">◇</span><div><h2>{projectCards.find(item => item[0] === active)?.[1]}</h2><p>Interactive project panel.</p></div></div><label>Test URL</label><div className="analyze-row"><input defaultValue="https://example.com" /><button className="btn-analyze">Analyze</button></div><div className="score-grid"><div className="score-card ring"><span>Overall Score</span><strong>71</strong><small>/ 100</small></div><div className="score-card"><span>Status</span><strong className="ok">OK</strong><small>200</small></div><div className="score-card"><span>Response Time</span><strong>412</strong><small>ms</small></div><div className="score-card wide"><span>Final URL</span><small className="url-text">https://example.com/</small></div></div></div><div className="report-card"><div className="report-actions"><h2>Hardening Report</h2><div><button>Copy Report (JSON)</button><button>Export JSON</button></div></div><table><thead><tr><th>Check</th><th>Status</th><th>Severity</th><th>Recommendation</th></tr></thead><tbody><tr><td>HTTPS</td><td className="pass">Pass</td><td>Low</td><td>The site is using HTTPS.</td></tr><tr><td>Content Policy</td><td className="missing">Missing</td><td>Medium</td><td>Add a policy header.</td></tr><tr><td>HSTS</td><td className="missing">Missing</td><td>Medium</td><td>Enable transport policy.</td></tr><tr><td>Frame Options</td><td className="missing">Missing</td><td>Medium</td><td>Add frame policy.</td></tr><tr><td>Content Type Options</td><td className="missing">Missing</td><td>Low</td><td>Add content type policy.</td></tr><tr><td>Information Exposure</td><td className="pass">Pass</td><td>Low</td><td>No extra signal detected.</td></tr></tbody></table></div></div>
    </section>
  </main>
}
