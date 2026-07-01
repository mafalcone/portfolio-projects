import { useState } from 'react'
import { strengths } from './finalCards'

const skills = [
  'N1/N2/N3 Support',
  'Windows Server / Linux',
  'LAN/WAN Networks',
  'VLANs / VPN / ACL',
  'IT Infrastructure',
  'Backups',
  'Hyper-V / VMware',
  'Troubleshooting',
  'Leadership and coordination',
  'JavaScript / Node.js',
  'React / MERN',
  'Python / SQL',
  'MongoDB',
  'REST APIs',
  'Automation',
  'ChatGPT / Codex'
]

export function FinalTop() {
  const [showSkills, setShowSkills] = useState(false)

  function toggleSkills(event) {
    event.preventDefault()
    setShowSkills(value => !value)
  }

  return <>
    <header className="topbar">
      <div className="brand">
        <div className="logo-mark"><span>M</span><i>F</i></div>
        <div><strong>Manuel Falcone</strong><p>IT Professional | Infrastructure | Support | Automation | Security | Software</p></div>
      </div>
      <nav className="nav-links">
        <a className="active" href="#projects">Projects</a>
        <a href="#about">About</a>
        <a href="#skills" onClick={toggleSkills}>Skills</a>
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
        <p className="lead">IT Consultant with experience in N1/N2/N3 technical support, systems administration, infrastructure, networks, IT operations, development and automation. Technical-operational profile with a background combining incident resolution, operational continuity, coordination of technical teams, user/client support, documentation, operational leadership, management, process improvement and implementation of new technologies.</p>
        <div className="cta-row"><a className="btn-primary" href="#projects">View Projects <span>→</span></a><a className="btn-ghost" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">Repository <span>↧</span></a></div>
      </div>
      <aside className={`strengths-panel flip-panel ${showSkills ? 'show-skills' : ''}`} id="skills">
        <div className="flip-inner">
          <div className="flip-face flip-front"><div className="panel-title"><span>◇</span><h2>Core Strengths</h2></div><div className="strength-grid">{strengths.map(item => <div className={`strength-card ${item.color}`} key={item.title}><span>{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div></div>
          <div className="flip-face flip-back"><div className="panel-title"><span>▦</span><h2>Skills</h2></div><div className="skills-list flip-skills">{skills.map(skill => <span key={skill}>{skill}</span>)}</div><button className="flip-back-button" onClick={() => setShowSkills(false)}>Back to strengths</button></div>
        </div>
      </aside>
    </section>
  </>
}
