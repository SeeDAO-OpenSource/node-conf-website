interface NodeData {
  root: string
  leaves: {
    account: string
    proof: string[]
  }[]
}

export async function getSeasonCandidate(seasonIdx: number): Promise<string[]> {
  try {
    // Import the JSON file dynamically based on season index

    const nodeData: NodeData =
      import.meta.env.VITE_CHAIN === 'testnet'
        ? await import(`../data/test-node/s${seasonIdx}Nodes.json`)
        : await import(`../data/node/s${seasonIdx}Nodes.json`)

    // Extract and return array of account addresses
    return nodeData.leaves.map(leaf => leaf.account)
  } catch (error) {
    console.error(`Error reading season ${seasonIdx} node data:`, error)
    throw error
  }
}
