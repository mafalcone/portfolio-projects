import { useEffect, useState } from 'react'
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

function scrollToExistingTarget(id, mode = 'center') {
  const section = document.getElementById(id)
  if (!section) return

  const rect = section.getBoundingClientRect()
  const absoluteTop = window.scrollY + rect.top
  const targetTop = mode === 'start'
    ? absoluteTop - 82
    : absoluteTop + (rect.height / 2) - (window.innerHeight / 2)

  window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
}

function GitHubIcon() {
  return <svg className="github-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.6 4.7 18.6 5 18.6 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" /></svg>
}

function blockProfileImageAction(event) {
  event.preventDefault()
}

export function FinalTop({ view = 'projects', setView = () => {}, navigateTo = () => {} }) {
  const [showSkills, setShowSkills] = useState(false)
  const [activeNav, setActiveNav] = useState(view)

  useEffect(() => {
    if (view === 'experience') setActiveNav('experience')
    if (view === 'projects' && activeNav === 'experience') setActiveNav('projects')
  }, [view, activeNav])

  function showAbout(event) {
    event.preventDefault()
    setActiveNav('about')
    scrollToExistingTarget('about', 'start')
  }

  function showSkillsPanel(event) {
    event.preventDefault()
    setActiveNav('skills')
    setShowSkills(prev => !prev)
    scrollToExistingTarget('skills', 'center')
  }

  function showProjects(event) {
    event.preventDefault()
    setActiveNav('projects')
    navigateTo('projects')
  }

  function showExperience(event) {
    event.preventDefault()
    setActiveNav('experience')
    navigateTo('experience')
  }

  return <>
    <header className="topbar">
      <div className="brand">
        <div className="logo-mark"><span>M</span><i>F</i></div>
        <div><strong>Manuel Falcone</strong><p>Operations Lead | Infrastructure | Support | Automation | Security | Software</p></div>
      </div>
      <nav className="nav-links">
        <a className={activeNav === 'projects' ? 'active' : ''} href="#projects" onClick={showProjects}>Projects</a>
        <a className={activeNav === 'about' ? 'active' : ''} href="#about" onClick={showAbout}>About</a>
        <a className={activeNav === 'skills' ? 'active' : ''} href="#skills" onClick={showSkillsPanel}>Skills</a>
        <a className={activeNav === 'experience' ? 'active' : ''} href="#experience" onClick={showExperience}>Experience</a>
        <a href="mailto:manu.axl@hotmail.com">Contact</a>
        <a className="github-dot" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer" aria-label="GitHub repository"><GitHubIcon /></a>
      </nav>
    </header>

    <section className="hero-dashboard" id="about">
      <div
        className="portrait-card"
        role="img"
        aria-label="Manuel Falcone"
        draggable="false"
        onContextMenu={blockProfileImageAction}
        onDragStart={blockProfileImageAction}
      ><div className="portrait-fallback">MF</div></div>
      <div className="hero-copy">
        <h1>MANUEL FALCONE</h1>
        <h2>Operations Lead | IT Infrastructure &amp; Support<br />Automation | Security | Software</h2>
        <p className="lead">Operations Lead and IT Consultant with experience in technical support, systems administration, infrastructure, networks, IT operations, development and automation. Technical-operational profile combining incident resolution, operational continuity, coordination and supervision of technical teams, user/client support, documentation, operational leadership, management, process improvement and implementation of new technologies.</p>
        <div className="cta-row"><a className="btn-primary" href="#projects" onClick={showProjects}>View Projects <span>→</span></a><a className="btn-ghost" href="https://github.com/mafalcone/portfolio-projects" target="_blank" rel="noreferrer">Repository <span>↧</span></a></div>
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
