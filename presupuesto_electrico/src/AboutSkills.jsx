const skills = [
  'Soporte N1/N2/N3',
  'Windows Server / Linux',
  'Redes LAN/WAN',
  'VLANs / VPN / ACL',
  'Infraestructura IT',
  'Backups',
  'Hyper-V / VMware',
  'Troubleshooting',
  'Liderazgo y coordinación',
  'JavaScript / Node.js',
  'React / MERN',
  'Python / SQL',
  'MongoDB',
  'APIs REST',
  'Automatización',
  'ChatGPT / Codex'
]

export function AboutSkills() {
  return <section className="about-skills" id="experience">
    <div className="about-card">
      <div className="section-title"><span>◎</span><h2>About</h2></div>
      <p>Consultor IT con experiencia en soporte técnico N1/N2/N3, administración de sistemas, infraestructura, redes, operaciones IT, desarrollo y automatización. Perfil técnico-operativo, con trayectoria combinando resolución de incidencias, continuidad operativa, coordinación de equipos técnicos, atención a usuarios/clientes, documentación, liderazgo operativo, gestión, mejora de procesos e implementación de nuevas tecnologías.</p>
    </div>
    <div className="skills-card">
      <div className="section-title"><span>▦</span><h2>Skills</h2></div>
      <div className="skills-list">{skills.map(skill => <span key={skill}>{skill}</span>)}</div>
    </div>
  </section>
}
