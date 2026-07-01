const experiences = [
  {
    role: 'Consultor IT',
    date: '2022 - Actualidad',
    area: 'Soporte, infraestructura, desarrollo y automatización',
    bullets: [
      'Consultoría IT independiente en infraestructura, redes, sistemas, desarrollo de software e IA.',
      'Diagnóstico y resolución de incidencias en servidores, redes, conectividad, sistemas y herramientas operativas.',
      'Desarrollo de software, soluciones web y automatizaciones con JavaScript/Node.js, React/MERN, Python, SQL, MongoDB y APIs REST.',
      'Documentación de procesos técnicos e integración de herramientas IA y flujos asistidos por LLMs para mejorar tareas operativas.'
    ]
  },
  {
    role: 'Supervisor de producción / CRE-FAL',
    date: '2024 - 2025',
    area: 'Supervisión operativa, coordinación',
    bullets: [
      'Gestión y coordinación de tareas de producción en fábrica.',
      'Organización de prioridades.',
      'Supervisión de producción de máquinas.',
      'Coordinación de personas, tareas técnicas y resolución de problemas.'
    ]
  },
  {
    role: 'Jefe de Operaciones / Net2One',
    date: '2021 - 2022',
    area: 'Operaciones IT, coordinación técnica, proveedores y continuidad',
    bullets: [
      'Gestión y liderazgo de equipos técnicos en sitio y remotos; coordinación de prioridades, incidencias y tareas operativas.',
      'Soporte técnico nivel 2, administración de Windows Server, red y sistemas virtualizados con Hyper-V.',
      'Diseño e implementación de soluciones de backup, seguimiento de KPIs, capacitación de técnicos y continuidad del servicio.',
      'Implementación de seguridad en redes y sistemas.'
    ]
  },
  {
    role: 'Implantador HW & SW / TECSIDEL',
    date: '2019 - 2020',
    area: 'Implementación técnica, soporte en campo y operación',
    bullets: [
      'Configuración y monitoreo de sistemas de peaje automatizados y peajes convencionales.',
      'Administración de Windows Server, Linux y sistemas virtualizados en VMware.',
      'Implementación de servicios automatizados y web services; testeo de soluciones de software y hardware.',
      'Desarrollo conjunto con equipos remotos de distintas áreas para integración de proyectos.'
    ]
  },
  {
    role: 'Administrador de Sistemas / Net2One',
    date: '2017 - 2019',
    area: 'Sistemas, infraestructura, soporte N1/N2/N3 y aplicaciones críticas',
    bullets: [
      'Soporte técnico N1/N2/N3 y administración/configuración de sistemas, red y Windows Server.',
      'Administración de sistemas virtualizados con Hyper-V, soluciones de backup y diagnóstico/resolución de problemas.',
      'Implementación de nuevas tecnologías y sistemas; coordinación de tareas con equipos internos, proveedores y distintas áreas.',
      'Implementación y soporte de switches, routers y firewalls; soporte a aplicaciones médicas, PACS y portal de estudios; implementación de seguridad en redes.'
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
