export const strengths = [
  { title: 'Infrastructure', text: 'Servers, networks, virtualization and backups', color: 'blue', icon: '▤' },
  { title: 'Support N2 / N3', text: 'Troubleshooting, incidents and escalations', color: 'green', icon: '◖' },
  { title: 'Software / Automation', text: 'Scripts, APIs, workflows and tools', color: 'purple', icon: '⚙' },
  { title: 'DevOps', text: 'Monitoring, logs, reviews and best practices', color: 'orange', icon: '▣' }
]

export const projects = [
  {
    id: 'taskpulse',
    title: 'TaskPulse',
    desc: 'Task management system with dashboard behavior.',
    stack: 'React · Vite · LocalStorage',
    color: 'blue',
    icon: '☑',
    tag: 'NEW',
    interviewNote: 'Shows a small operations dashboard: task states, priority, filters, progress metrics and local persistence. Useful to explain frontend state, CRUD logic, UI organization and operational workflows.'
  },
  {
    id: 'logs',
    title: 'Incident Log Triage',
    desc: 'Parse logs and classify events by type and severity.',
    stack: 'Log parsing · JS · Rules',
    color: 'green',
    icon: '▦',
    tag: 'NEW',
    interviewNote: 'Shows incident analysis from raw logs: parsing, classification, severity counts and troubleshooting signals. Useful to talk about support N2/N3, monitoring, rules, triage and incident response.'
  },
  {
    id: 'site',
    title: 'Web Hardening Review',
    desc: 'Review headers and public response signals.',
    stack: 'Node.js · API · Report',
    color: 'purple',
    icon: '◇',
    tag: 'NEW',
    interviewNote: 'Checks public web headers and response signals: HTTPS, CSP, HSTS, frame protection, content-type protection and exposed server headers. Useful for API design, reports and web review basics.'
  },
  {
    id: 'python-review-lab',
    title: 'Python Code Review Lab',
    desc: 'Static review demo for behavior indicators in Python snippets.',
    stack: 'React · Python snippet review · Rules engine · JSON report',
    color: 'orange',
    icon: '⌕',
    tag: 'REVIEW',
    interviewNote: 'Static review lab that checks Python snippets, explains notable indicators, and produces an interview-ready report without running pasted code.'
  },
  {
    id: 'estimate',
    title: 'Service Estimate',
    desc: 'Create service quotes and export PDF.',
    stack: 'React · jsPDF · LocalStorage',
    color: 'orange',
    icon: '▣',
    interviewNote: 'Shows a practical business tool: editable service items, totals, persistence and PDF export. Useful to explain client-facing tools, forms, calculations, document generation and small workflow automation.'
  },
  {
    id: 'nutrition',
    title: 'Nutrition Analyzer',
    desc: 'Search nutrition facts for foods.',
    stack: 'Data lookup · React',
    color: 'blue',
    icon: '♢',
    interviewNote: 'Shows structured data lookup with examples, matching logic and clear UI feedback. Useful to explain datasets, search behavior, validation, UX states and reusable React components.'
  }
]
