import { projects } from './finalCards'

function scrollToActiveProject() {
  window.setTimeout(() => {
    const panel = document.getElementById('active-project')
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }, 120)
}

export function FinalProjectGrid({ active, setActive }) {
  function openProject(projectId) {
    setActive(projectId)
    scrollToActiveProject()
  }

  return <section className="featured view-block" id="projects">
    <div className="section-title"><span>&lt;/&gt;</span><h2>Demo Projects</h2></div>
    <div className="feature-grid">
      {projects.map(project => <button className={`feature-card ${project.color} ${active === project.id ? 'active' : ''}`} key={project.id} onClick={() => openProject(project.id)} data-tooltip={project.interviewNote} aria-label={`${project.title}. ${project.interviewNote}`}>
        <span className="feature-icon">{project.icon}</span>
        <div>
          <div className="feature-title-row"><h3>{project.title}</h3>{project.tag && <b className={`badge ${project.color}`}>{project.tag}</b>}</div>
          <p>{project.desc}</p>
          <small>{project.stack}</small>
          <span className="interview-note">{project.interviewNote}</span>
          <em>Open Project →</em>
        </div>
      </button>)}
    </div>
  </section>
}
