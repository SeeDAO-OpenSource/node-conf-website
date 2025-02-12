interface SeasonProposal {
  // Add specific fields based on the actual API response
  link: string
  season: string
  category: string
  title: string
  create: number
  applicant?: string
}

interface ResSeasonProposalsData {
  code: number
  msg: string
  data: SeasonProposal[]
}

const BASE_URL = 'https://api.seedao.tech/v1'

export async function getSeasonProposals(seasonIdx: number): Promise<ResSeasonProposalsData> {
  try {
    const response = await fetch(`${BASE_URL}/public_data/get_season_proposals/${seasonIdx}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data as ResSeasonProposalsData
  } catch (error) {
    console.error('Error fetching season proposals:', error)
    throw error
  }
}
