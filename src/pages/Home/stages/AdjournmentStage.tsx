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
    white-space: nowrap;
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
      {/* Conference Info Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col hero-bg px-[calc((100vw-101%)/2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">第{data.season}季节点共识大会</h1>

            {/* Conference Date */}
            <div className="inline-flex items-center gap-3 text-xl text-gray-600 mb-8">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {dayjs(data.startDate).format('YYYY年MM月DD日')} -{' '}
                {dayjs(data.endDate).format('MM月DD日')}
              </span>
            </div>

            {/* Conference Description */}
            <p className="text-lg text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
              SeeDAO节点共识大会是社区最重要的治理会议，每季度召开一次。节点们在会议中就社区发展的重要议题进行讨论和投票，共同决定SeeDAO的未来方向。
            </p>

            {/* Node Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {/* Current Season Info */}
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">当前节点信息</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">节点数量</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">{data.nodes.length}</span>
                      {data.sbtToken.explorerUrl && (
                        <a
                          href={data.sbtToken.explorerUrl + '?a=' + data.sbtToken.tokenId}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          合约 →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">有效SCR要求</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-600">
                          {data.currentCriteria.validSCR}
                        </span>
                        {data.currentCriteria.validSCRProposalLink && (
                          <a
                            href={data.currentCriteria.validSCRProposalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700"
                          >
                            提案 →
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">活跃SCR要求</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-600">
                          {data.currentCriteria.activeSCR}
                        </span>
                        {data.currentCriteria.activeSCRProposalLink && (
                          <a
                            href={data.currentCriteria.activeSCRProposalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700"
                          >
                            提案 →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-gray-100">
                    <div
                      className="text-primary-600 hover:text-primary-700 cursor-pointer text-xs"
                      onClick={() => setShowNodesModal(true)}
                    >
                      查看节点列表 →
                    </div>
                    <div
                      className="text-primary-600 hover:text-primary-700 cursor-pointer text-xs"
                      onClick={() => setShowCandidatesModal(true)}
                    >
                      查看候选人名单 →
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Season Info */}
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">下季节点要求</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">有效SCR要求</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">
                        {data.nextSeasonCriteria.validSCR}
                      </span>
                      {data.nextSeasonCriteria.validSCRProposalLink && (
                        <a
                          href={data.nextSeasonCriteria.validSCRProposalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          提案 →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">活跃SCR要求</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">
                        {data.nextSeasonCriteria.activeSCR}
                      </span>
                      {data.nextSeasonCriteria.activeSCRProposalLink && (
                        <a
                          href={data.nextSeasonCriteria.activeSCRProposalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          提案 →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">要求SEED数量</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">1</span>
                      {
                        <a
                          href="https://node.seedao.xyz/about/noderules"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          规则 →
                        </a>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="relative bg-white px-[calc((100vw-101%)/2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">会议日程</h2>
          <div className="space-y-6">
            {Object.entries(
              data.schedule.reduce(
                (acc, session) => {
                  const date = dayjs(session.time).format('YYYY-MM-DD')
                  if (!acc[date]) acc[date] = []
                  acc[date].push(session)
                  return acc
                },
                {} as Record<string, typeof data.schedule>
              )
            ).map(([date, sessions]) => (
              <div key={date} className="bg-gray-50 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-primary-700 mb-4">
                  {dayjs(date).format('YYYY年MM月DD日')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[120px]">
                          时间
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-1/2">
                          主题
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                          演讲人
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessions.map((session, index) => (
                        <tr key={index} className="hover:bg-white transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {dayjs(session.time).format('HH:mm')}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {session.topic}
                          </td>
                          <td className="py-3 px-4 text-sm text-primary-600">{session.speaker}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Conference Materials */}
          {Array.isArray(data.recordings) && data.recordings.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-primary-700 mb-4">会议资料</h3>
              <div className="bg-gray-50 rounded-xl p-6 shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[120px]">
                          类型
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                          资料
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.recordings.map((recording, index) => (
                        <tr key={index} className="hover:bg-white transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {recording.type === 'video' && (
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-5 h-5 text-primary-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                  </svg>
                                  <span className="text-sm text-primary-600">视频</span>
                                </div>
                              )}
                              {recording.type === 'slides' && (
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-5 h-5 text-secondary-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                  </svg>
                                  <span className="text-sm text-secondary-600">幻灯片</span>
                                </div>
                              )}
                              {recording.type === 'article' && (
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-sm text-gray-600">文章</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <a
                              href={recording.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {recording.name}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Proposals Section */}
      <section className="relative bg-gray-50 px-[calc((100vw-101%)/2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">本季提案</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.proposals.map(proposal => (
              <div
                key={proposal.link}
                className="bg-white rounded-xl p-6 shadow-lg transition-all duration-200 group hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="tag tag-primary">{proposal.category}</span>
                  <span className="tag tag-accent"> {getStatus(proposal.state!)}</span>
                </div>
                <h3 className="text-xl font-medium mb-4 group-hover:text-primary-600 transition-colors">
                  {proposal.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {proposal.avatar && (
                      <img
                        src={proposal.avatar}
                        className="w-10 h-10 rounded-full ring-2 ring-primary-100 group-hover:ring-primary-200 transition-colors"
                      />
                    )}
                    <div>
                      {!!proposal.applicant && (
                        <span className="text-gray-900 font-medium block">
                          {snsMap[proposal.applicant.toLowerCase()!] ??
                            truncateAddress(proposal.applicant!)}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">提案人</span>
                    </div>
                  </div>
                  <a
                    href={proposal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary px-2 sm:px-4"
                  >
                    查看提案
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative bg-white px-[calc((100vw-101%)/2)]">
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
