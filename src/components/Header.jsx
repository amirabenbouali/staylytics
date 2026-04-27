function Header({ fallbackNotice }) {
  return (
    <header>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
          London Airbnb Market Dashboard
        </h1>
        <p className="mt-2 text-base text-[#41516B]">
          Explore pricing, availability and demand trends across London listings.
        </p>
        {fallbackNotice ? (
          <p className="mt-4 rounded-xl bg-[#FFF0F0] px-4 py-3 text-sm font-medium text-[#A83F43]">
            {fallbackNotice}
          </p>
        ) : null}
      </div>
    </header>
  )
}

export default Header
