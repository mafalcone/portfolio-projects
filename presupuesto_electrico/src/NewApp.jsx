import { useState } from 'react'
import { flushSync } from 'react-dom'
import { FinalTop } from './FinalTop'
import { FinalProjectGrid } from './FinalProjectGrid'
import { ExperiencePanel } from './ExperiencePanel'
import { FinalWebPanel } from './FinalWebPanel'
import { FinalLogsPanel } from './FinalLogsPanel'
import { TaskPulsePanel, NutritionPanel, EstimatePanel, PythonPanel } from './FinalOtherPanels'
import { NewsIntelligenceCaseStudy } from './NewsIntelligenceCaseStudy'

function scrollToSectionContent(viewName) {
  const target = viewName === 'experience'
    ? document.querySelector('.experience-view .section-title') || document.querySelector('.experience-view')
    : document.querySelector('#projects .section-title') || document.getElementById('projects')

  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
}

export default function NewApp() {
  const [active, setActive] = useState('news-intelligence')
  const [view, setView] = useState('projects')

  function navigateTo(nextView) {
    flushSync(() => {
      setView(nextView)
    })

    requestAnimationFrame(() => {
      scrollToSectionContent(nextView)
    })
  }

  return <main className="cyber-page">
    <FinalTop view={view} navigateTo={navigateTo} />
    {view === 'projects' && <>
      <FinalProjectGrid active={active} setActive={setActive} />
      <section className={`active-project-panel ${active}`} id="active-project">
        {active === 'news-intelligence' && <NewsIntelligenceCaseStudy />}
        {active === 'site' && <FinalWebPanel />}
        {active === 'logs' && <FinalLogsPanel />}
        {active === 'taskpulse' && <TaskPulsePanel />}
        {active === 'python-review-lab' && <PythonPanel />}
        {active === 'nutrition' && <NutritionPanel />}
        {active === 'estimate' && <EstimatePanel />}
      </section>
    </>}
    {view === 'experience' && <ExperiencePanel />}
  </main>
}
