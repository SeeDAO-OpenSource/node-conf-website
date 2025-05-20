import React, { useEffect, useState } from 'react'
import type { ConferenceData } from '../../../types/conference'
import Modal from '../../../components/Modal'
import { truncateAddress } from '../../../utils/address'
import dayjs from 'dayjs'
import ReactMarkdown from 'react-markdown'
import faqContent from '../../../content/faq.md?raw'
import useQuerySNS from '../../../hooks/useQuerySNS.tsx'
import { getStatus } from '../../../utils/public.ts'
import DefaultImg from '../../../assets/images/defaultAvatar.png'
import styled from 'styled-components'

const Box = styled.div`
  td,
  th {
    word-break: break-all;
  }

  @media (max-width: 1024px) {
    td,
    th {
      white-space: nowrap;
    }
  }
`

interface Props {
  data: ConferenceData
}

export default function AdjournmentStage({ data }: Props) {
  const [showNodesModal, setShowNodesModal] = useState(false)
  const [showCandidatesModal, setShowCandidatesModal] = useState(false)
  const [snsMap, setSnsMap] = useState<Record<string, string>>({})
  const { getMultiSNS } = useQuerySNS()

  const handleSNS = async (wallets: string[]) => {
    try {
      const sns_map = await getMultiSNS(wallets)
      setSnsMap(sns_map)
    } catch (error: unknown) {
      console.log(error)
    }
  }

  useEffect(() => {
    const proposalArr = data.proposals.filter(d => !!d.applicant).map(d => d.applicant)

    const nodesArr = data.nodes.filter(d => !!d.wallet).map(d => d.wallet)

    const arr = [...proposalArr, ...nodesArr, ...data.candidates]
    handleSNS([...new Set(arr)])
  }, [data])

  return (
    <Box className="space-y-0 -mx-[calc((100vw-101%)/2)] overflow-x-hidden ">
      {/* FAQ Section */}
      <section className="relative bg-gray-50 px-[calc((100vw-101%)/2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">常见问题</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqContent
              .split('##')
              .slice(1)
              .map((section, index) => {
                const [headerLine, ...contentLines] = section.trim().split('\n')
                const [type, title] = headerLine.split(':').map(s => s.trim())
                const content = contentLines.join('\n').trim()

                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl border-l-4 ${
                      type.includes('primary')
                        ? 'border-primary-500 hover:border-primary-600'
                        : 'border-accent-500 hover:border-accent-600'
                    }`}
                  >
                    <h3
                      className={`text-xl font-semibold mb-4 ${
                        type.includes('primary') ? 'text-primary-700' : 'text-accent-700'
                      }`}
                    >
                      {title}
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={showNodesModal} onClose={() => setShowNodesModal(false)} title="节点列表">
        <div className="space-y-4 ">
          {data.nodes.map((node, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors "
            >
              <div className="flex items-center gap-4">
                <img
                  src={node.avatar || DefaultImg}
                  alt={snsMap[node?.wallet.toLowerCase()] ?? truncateAddress(node?.wallet)}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center ">
                  <div className="font-medium text-gray-900">
                    {snsMap[node?.wallet.toLowerCase()] ?? truncateAddress(node?.wallet)}
                  </div>
                  <div className="text-sm text-gray-500 font-mono break-all">
                    {/*{truncateAddress(node?.wallet)}*/}
                    {node?.wallet}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={showCandidatesModal}
        onClose={() => setShowCandidatesModal(false)}
        title="候选人列表"
      >
        <div className="space-y-4">
          {data.candidates.map((candidate, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col sm:flex-row items-start gap-4 sm:items-center"
            >
              <div className="font-medium text-gray-900">
                {' '}
                {snsMap[candidate.toLowerCase()] ?? truncateAddress(candidate)}
              </div>
              <div className="text-sm  text-gray-500 font-mono break-all">
                {/*{truncateAddress(candidate)}*/}
                {candidate}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </Box>
  )
}
