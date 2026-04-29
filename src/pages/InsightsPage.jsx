import PageHeader from '../components/ui/PageHeader'
import { generateExecutiveInsights } from '../utils/insightAnalytics'

function SectionCard({ title, eyebrow, children, accent = '#FF5A5F' }) {
  return (
    <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-bold text-[#111827]">{title}</h2>
      <div className="mt-4 text-base leading-7 text-[#374151]">{children}</div>
    </article>
  )
}

function InsightsPage({ listings }) {
  const insights = generateExecutiveInsights(listings)

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-7 sm:px-6 sm:py-8 lg:space-y-8 lg:px-10 lg:py-10">
        <PageHeader
          title="Insights"
          subtitle="A concise interpretation of pricing, demand, and supply patterns across London."
          action={(
            <div className="rounded-2xl border border-[#ECE7DF] bg-white px-5 py-4 text-sm text-[#6B7280] shadow-sm">
              Rule-based market summary
            </div>
          )}
        />

        <section className="rounded-3xl border border-[#F7DDD8] bg-[linear-gradient(120deg,#FFF3F0,#FFFFFF)] p-6 shadow-[0_22px_60px_rgba(255,90,95,0.12)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#FF5A5F] text-white shadow-[0_14px_32px_rgba(255,90,95,0.28)]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <div className="max-w-5xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#FF5A5F]">
                Key Takeaways
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">
                What matters most in this market
              </h2>
              <ul className="mt-6 grid gap-4">
                {insights.takeaways.map((takeaway) => (
                  <li key={takeaway} className="flex gap-3 text-base leading-7 text-[#111827]">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FF5A5F]" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:gap-6 lg:grid-cols-3">
          <SectionCard title="Pricing Insights" eyebrow="Pricing" accent="#FF5A5F">
            <p>{insights.pricingInsight}</p>
          </SectionCard>
          <SectionCard title="Demand Insights" eyebrow="Demand" accent="#4F46E5">
            <p>{insights.demandInsight}</p>
          </SectionCard>
          <SectionCard title="Supply Insights" eyebrow="Supply" accent="#15965C">
            <p>{insights.supplyInsight}</p>
          </SectionCard>
        </section>

        <section className="grid gap-5 lg:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard title="Cross-Market Insight" eyebrow="Connected Signals" accent="#F97316">
            <p>{insights.crossInsight}</p>
          </SectionCard>

          <article className="rounded-2xl border border-[#ECE7DF] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5A5F]">
              Recommendations
            </p>
            <h2 className="mt-3 text-xl font-bold text-[#111827]">Actions to consider</h2>
            <ol className="mt-5 space-y-4">
              {insights.recommendations.map((recommendation, index) => (
                <li key={recommendation} className="flex gap-4 text-base leading-7 text-[#374151]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FFF0F0] text-sm font-bold text-[#FF5A5F]">
                    {index + 1}
                  </span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ol>
          </article>
        </section>

        <p className="pb-4 text-sm text-[#6B7280]">
          Insights are generated from the same pricing, availability, and demand logic used across Staylytics.
        </p>
      </div>
    </div>
  )
}

export default InsightsPage
