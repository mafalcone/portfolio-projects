import { useState } from 'react'
import { FinalTop } from './FinalTop'
import { AboutSkills } from './AboutSkills'
import { FinalProjectGrid } from './FinalProjectGrid'
import { FinalWebPanel } from './FinalWebPanel'
import { FinalLogsPanel } from './FinalLogsPanel'
import { TaskPulsePanel, NutritionPanel, EstimatePanel } from './FinalOtherPanels'

export default function NewApp() {
  const [active, setActive] = useState('site')
  return <main className="cyber-page">
    <FinalTop />
    <AboutSkills />
    <FinalProjectGrid active={active} setActive={setActive} />
    <section className={`active-project-panel ${active}`}>
      {active === 'site' && <FinalWebPanel />}
      {active === 'logs' && <FinalLogsPanel />}
      {active === 'taskpulse' && <TaskPulsePanel />}
      {active === 'nutrition' && <NutritionPanel />}
      {active === 'estimate' && <EstimatePanel />}
    </section>
  </main>
}
