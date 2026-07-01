const experiences = [
  {
    role: 'IT Consultant',
    date: '2022 - Present',
    area: 'Support, infrastructure, development and automation',
    bullets: [
      'Independent IT consulting in infrastructure, networks, systems, software development and AI.',
      'Diagnosis and resolution of incidents in servers, networks, connectivity, systems and operational tools.',
      'Software development, web solutions and automations with JavaScript/Node.js, React/MERN, Python, SQL, MongoDB and REST APIs.',
      'Technical process documentation and integration of AI tools and LLM-assisted workflows to improve operational tasks.'
    ]
  },
  {
    role: 'Production Supervisor / CRE-FAL',
    date: '2024 - 2025',
    area: 'Operational supervision and coordination',
    bullets: [
      'Management and coordination of production tasks in a factory environment.',
      'Organization of priorities.',
      'Supervision of machine production.',
      'Coordination of people, technical tasks and problem resolution.'
    ]
  },
  {
    role: 'Head of Operations / Net2One',
    date: '2021 - 2022',
    area: 'IT operations, technical coordination, vendors and continuity',
    bullets: [
      'Management and leadership of on-site and remote technical teams; coordination of priorities, incidents and operational tasks.',
      'Level 2 technical support, Windows Server administration, networking and virtualized systems with Hyper-V.',
      'Design and implementation of backup solutions, KPI tracking, technician training and service continuity.',
      'Implementation of network and systems security.'
    ]
  },
  {
    role: 'HW & SW Implementer / TECSIDEL',
    date: '2019 - 2020',
    area: 'Technical implementation, field support and operation',
    bullets: [
      'Configuration and monitoring of automated toll systems and conventional toll systems.',
      'Administration of Windows Server, Linux and virtualized systems in VMware.',
      'Implementation of automated services and web services; testing of software and hardware solutions.',
      'Joint development with remote teams from different areas for project integration.'
    ]
  },
  {
    role: 'Systems Administrator / Net2One',
    date: '2017 - 2019',
    area: 'Systems, infrastructure, N1/N2/N3 support and critical applications',
    bullets: [
      'N1/N2/N3 technical support and administration/configuration of systems, network and Windows Server.',
      'Administration of virtualized systems with Hyper-V, backup solutions and troubleshooting/problem resolution.',
      'Implementation of new technologies and systems; coordination of tasks with internal teams, vendors and different areas.',
      'Implementation and support of switches, routers and firewalls; support for medical applications, PACS and study portal; implementation of network security.'
    ]
  }
]

export function ExperiencePanel() {
  return <section className="experience-view view-block" id="experience">
    <div className="section-title"><span>▤</span><h2>Experience</h2></div>
    <div className="experience-timeline">
      {experiences.map(item => <article className="experience-card" key={`${item.role}-${item.date}`}>
        <div className="experience-head"><div><h3>{item.role}</h3><p>{item.area}</p></div><strong>{item.date}</strong></div>
        <ul>{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
      </article>)}
    </div>
  </section>
}
