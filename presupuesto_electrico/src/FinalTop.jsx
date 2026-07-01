import { strengths } from './finalCards'

export function FinalTop() {
  return <>
    <header className="topbar">
      <div className="brand">
        <div className="logo-mark"><span>M</span><i>F</i></div>
        <div><strong>Manuel Falcone</strong><p>IT Professional | Infrastructure | Support | Automation | Security | Software</p></div>
      </div>
      <nav className="nav-links">
        <a className="active" href="#projects">Projects</a>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#experience">Experience</a>
        <a href="mailto:manu.axl@hotmail.com">Contact</a>
        <a className="github-dot" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">●</a>
      </nav>
    </header>

    <section className="hero-dashboard" id="about">
      <div className="portrait-card"><img src="https://github.com/mafalcone.png" alt="Manuel Falcone" /><div className="portrait-fallback">MF</div></div>
      <div className="hero-copy">
        <p className="hello">Hello, I'm</p>
        <h1>MANUEL FALCONE</h1>
        <h2>IT Infrastructure &amp; Support | Automation Builder | Security | Software</h2>
        <p className="lead">I design, build and maintain reliable systems and tools that solve real problems. Focused on infrastructure, automation and security with a strong support background (N1 / N2 / N3).</p>
        <div className="cta-row"><a className="btn-primary" href="#projects">View Projects <span>→</span></a><a className="btn-ghost" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">Repository <span>↧</span></a></div>
      </div>
      <aside className="strengths-panel" id="skills"><div className="panel-title"><span>◇</span><h2>Core Strengths</h2></div><div className="strength-grid">{strengths.map(item => <div className={`strength-card ${item.color}`} key={item.title}><span>{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div></aside>
    </section>
  </>
}
