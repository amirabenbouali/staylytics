import {
  getAvailabilityKPIs,
  getLeastAvailableBoroughs,
  getTopAvailableBoroughs,
} from './availabilityAnalytics'
import {
  getDemandKPIs,
  getLeastDemandBoroughs,
  getTopDemandBoroughs,
  groupDemandByRoomType,
} from './demandAnalytics'
import {
  getPriceBuckets,
  getPriceKPIs,
  getTopAffordableBoroughs,
  getTopExpensiveBoroughs,
} from './priceAnalytics'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-GB').format(Math.round(value || 0))
}

export function generateExecutiveInsights(data) {
  const priceKpis = getPriceKPIs(data)
  const availabilityKpis = getAvailabilityKPIs(data)
  const demandKpis = getDemandKPIs(data)
  const expensiveBorough = getTopExpensiveBoroughs(data)[0]
  const affordableBorough = getTopAffordableBoroughs(data)[0]
  const highDemandBorough = getTopDemandBoroughs(data)[0]
  const lowDemandBorough = getLeastDemandBoroughs(data)[0]
  const highAvailabilityBorough = getTopAvailableBoroughs(data)[0]
  const lowAvailabilityBorough = getLeastAvailableBoroughs(data)[0]
  const dominantRoomType = groupDemandByRoomType(data)[0]
  const largestPriceBucket = [...getPriceBuckets(data)].sort(
    (left, right) => right.count - left.count,
  )[0]

  const averageAboveMedian = priceKpis.averagePrice > priceKpis.medianPrice * 1.15
  const highDemandLowSupply =
    highDemandBorough?.borough && lowAvailabilityBorough?.borough
      ? highDemandBorough.borough === lowAvailabilityBorough.borough
      : false

  const takeaways = [
    `${expensiveBorough?.borough ?? 'Central London'} leads pricing at ${formatCurrency(
      expensiveBorough?.averagePrice,
    )} per night on average, while ${
      affordableBorough?.borough ?? 'outer boroughs'
    } offers the clearest value pocket.`,
    `Most listings sit in the ${
      largestPriceBucket?.label ?? 'mid-market'
    } price band, giving the market a strong mid-range base.`,
    `${highDemandBorough?.borough ?? 'High-review boroughs'} shows the strongest demand signal with ${formatNumber(
      highDemandBorough?.averageReviews,
    )} average reviews per listing.`,
    `${lowAvailabilityBorough?.borough ?? 'Lower-availability areas'} has the tightest supply, averaging ${formatNumber(
      lowAvailabilityBorough?.averageAvailability,
    )} available days per year.`,
  ]

  if (averageAboveMedian) {
    takeaways.push(
      `Average price is materially above the median, suggesting premium listings are lifting the headline market price.`,
    )
  }

  const pricingInsight = averageAboveMedian
    ? `The market is price-skewed: the average nightly price is ${formatCurrency(
        priceKpis.averagePrice,
      )}, compared with a median of ${formatCurrency(
        priceKpis.medianPrice,
      )}. That gap indicates a smaller set of high-end listings is pushing the overall average upward.`
    : `Pricing is relatively balanced: the average nightly price is ${formatCurrency(
        priceKpis.averagePrice,
      )}, close to the median of ${formatCurrency(
        priceKpis.medianPrice,
      )}. This suggests the filtered market is not being dominated by outlier luxury listings.`

  const demandInsight = `${highDemandBorough?.borough ?? 'The leading borough'} has the strongest demand proxy, while ${
    lowDemandBorough?.borough ?? 'lower-review areas'
  } shows weaker review activity. ${
    dominantRoomType?.roomType ?? 'The leading room type'
  } listings account for the largest share of reviewed supply, making them the clearest demand segment to monitor.`

  const supplyInsight = `${highAvailabilityBorough?.borough ?? 'The most available borough'} has the loosest supply, averaging ${formatNumber(
    highAvailabilityBorough?.averageAvailability,
  )} available days per year. ${
    lowAvailabilityBorough?.borough ?? 'The tightest borough'
  } has lower availability, which can indicate more frequent bookings or a smaller active supply pool.`

  const crossInsight = highDemandLowSupply
    ? `${highDemandBorough.borough} combines high review activity with low availability, a pattern consistent with strong demand pressure. If prices are also above market average, this is a premium high-velocity area rather than simply an expensive one.`
    : `The strongest demand and tightest supply are not concentrated in the same borough. This suggests London has multiple opportunity types: premium demand clusters, value-led demand areas, and boroughs with looser supply that may need sharper pricing.`

  const recommendations = [
    `Benchmark premium listings against ${expensiveBorough?.borough ?? 'the highest-priced borough'} before raising prices in central areas.`,
    `Use ${affordableBorough?.borough ?? 'lower-priced boroughs'} as a value reference when assessing budget or private-room opportunities.`,
    `Prioritise demand validation in ${highDemandBorough?.borough ?? 'high-review boroughs'} because review activity suggests stronger booking velocity.`,
    `Watch ${lowAvailabilityBorough?.borough ?? 'low-availability areas'} for supply pressure; lower availability can support firmer pricing if demand remains strong.`,
    `For new listings, compare both price and availability rather than relying on price alone; high price with weak demand may signal overpricing.`,
  ]

  return {
    takeaways,
    pricingInsight,
    demandInsight,
    supplyInsight,
    crossInsight,
    recommendations,
    metrics: {
      averagePrice: priceKpis.averagePrice,
      medianPrice: priceKpis.medianPrice,
      averageReviews: demandKpis.averageReviews,
      averageAvailability: availabilityKpis.averageAvailability,
    },
  }
}
