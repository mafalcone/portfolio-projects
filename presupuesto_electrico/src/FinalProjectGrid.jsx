import { projects } from './finalCards'

export function FinalProjectGrid({ active, setActive }) {
  return <section className="featured" id="projects">
    <div className="section-title"><span>&lt;/&gt;</span><h2>Featured Projects</h2></div>
    <div className="feature-grid">
      {projects.map(project => <button className={`feature-card ${project.color} ${active === project.id ? 'active' : ''}`} key={project.id} onClick={() => setActive(project.id)}>
        <span className="feature-icon">{project.icon}</span>
        <div>
          <div className="feature-title-row"><h3>{project.title}</h3>{project.tag && <b className={`badge ${project.color}`}>{project.tag}</b>}</div>
          <p>{project.desc}</p>
          <small>{project.stack}</small>
          <em>Open Project →</em>
        </div>
      </button>)}
    </div>
  </section>
}
