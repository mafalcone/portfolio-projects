import { useState } from 'react'
import { FinalTop } from './FinalTop'
import { AboutSkills } from './AboutSkills'
import { FinalProjectGrid } from './FinalProjectGrid'
import { ExperiencePanel } from './ExperiencePanel'
import { FinalWebPanel } from './FinalWebPanel'
import { FinalLogsPanel } from './FinalLogsPanel'
import { TaskPulsePanel, NutritionPanel, EstimatePanel } from './FinalOtherPanels'

export default function NewApp() {
  const [active, setActive] = useState('site')
  const [view, setView] = useState('projects')
  return <main className="cyber-page">
    <FinalTop view={view} setView={setView} />
    <AboutSkills />
    {view === 'projects' && <>
      <FinalProjectGrid active={active} setActive={setActive} />
      <section className={`active-project-panel ${active}`}>
        {active === 'site' && <FinalWebPanel />}
        {active === 'logs' && <FinalLogsPanel />}
        {active === 'taskpulse' && <TaskPulsePanel />}
        {active === 'nutrition' && <NutritionPanel />}
        {active === 'estimate' && <EstimatePanel />}
      </section>
    </>}
    {view === 'experience' && <ExperiencePanel />}
  </main>
}
