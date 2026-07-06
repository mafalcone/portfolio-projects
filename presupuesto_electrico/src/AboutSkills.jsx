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

export function AboutSkills() {
  return <section className="about-skills" id="about-skills">
    <div className="about-card">
      <div className="section-title"><span>◎</span><h2>About</h2></div>
      <p>IT Consultant with experience in technical support, systems administration, infrastructure, networks, IT operations, development and automation. Technical-operational profile combining incident resolution, operational continuity, technical team coordination, user/client support, documentation, operational leadership, process improvement and implementation of new technologies.</p>
    </div>
    <div className="skills-card">
      <div className="section-title"><span>▦</span><h2>Skills</h2></div>
      <div className="skills-list">{skills.map(skill => <span key={skill}>{skill}</span>)}</div>
    </div>
  </section>
}
