import fs from 'node:fs/promises'
import path from 'node:path'
import {
  compactListings,
  parseListingsCsv,
  processListingsData,
} from '../src/utils/dataProcessing.js'

const projectRoot = process.cwd()
const inputPath = path.join(projectRoot, 'src/data/london_listings.csv')
const outputPath = path.join(projectRoot, 'src/data/london_listings.json')

const csv = await fs.readFile(inputPath, 'utf8')
const parsedRows = await parseListingsCsv(csv)
const cleaned = processListingsData(parsedRows)
await fs.writeFile(outputPath, JSON.stringify(compactListings(cleaned)))

console.log(`Processed ${parsedRows.length.toLocaleString()} rows`)
console.log(`Wrote ${cleaned.length.toLocaleString()} valid listings to ${outputPath}`)
