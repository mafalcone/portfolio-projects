const experiences = [
  {
    role: 'IT Consultant',
    area: 'Infrastructure · Support · Automation',
    text: 'Technical support, systems administration, infrastructure, networks, troubleshooting, documentation, process improvement and automation for operational environments.'
  },
  {
    role: 'Factory and Production Manager / CRE-FAL',
    area: 'Operations · Leadership · Process Management',
    text: 'Operational leadership, production coordination, team organization, client/vendor coordination, workflow control and continuous improvement.'
  },
  {
    role: 'Operations Lead / Net2One',
    area: 'IT Operations · Technical Team Coordination',
    text: 'Coordination of technical teams, incident follow-up, client continuity, support operations, vendor communication and operational reporting.'
  },
  {
    role: 'Systems Administrator / Net2One',
    area: 'Servers · Networks · Backups · Support',
    text: 'Windows Server administration, network troubleshooting, backups, infrastructure support, user support and operational issue resolution.'
  },
  {
    role: 'HW & SW Deployment Specialist / TECSIDEL',
    area: 'Implementation · Field Support · Technical Delivery',
    text: 'Hardware and software implementation, installation support, technical validation, field troubleshooting and deployment documentation.'
  }
]

export function ExperiencePanel() {
  return <section className="experience-view view-block" id="experience">
    <div className="section-title"><span>▤</span><h2>Experience</h2></div>
    <div className="experience-grid">
      {experiences.map(item => <article className="experience-card" key={item.role}>
        <p>{item.area}</p>
        <h3>{item.role}</h3>
        <span>{item.text}</span>
      </article>)}
    </div>
  </section>
}
