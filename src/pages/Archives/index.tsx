import React, { useState, useEffect } from 'react';
import { ConferenceData } from '../../types/conference';
import Modal from '../../components/Modal';
import { truncateAddress } from '../../utils/address';
import dayjs from 'dayjs';
import { CURRENT_SEASON } from '../../config/stage';
import useQuerySNS from "../../hooks/useQuerySNS.tsx";
import {getStatus} from "../../utils/public.ts";
import {getSeasonCandidate} from "../../api/getSeasonCandidate.ts";
import {getSeasonProposals} from "../../api/getSeasonProposals.ts";
import {getSeasonNodes} from "../../api/getSeasonNodes.ts";

export default function ArchivesPage() {
  const [data, setData] = useState<Record<number, ConferenceData>>({});
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [showNodesModal, setShowNodesModal] = useState(false);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [snsMap, setSnsMap] = useState<any>({});

  const { getMultiSNS } = useQuerySNS();

  const handleSNS = async (wallets: string[]) => {
    try{
      const sns_map = await getMultiSNS(wallets);
      setSnsMap(sns_map);
    }catch(error:any){
      console.log(error);
    }

  };

  useEffect(() => {
    const loadSeasonData = async () => {
      try {
        const seasonData: Record<number, ConferenceData> = {};

        // Load all season data up to current season
        for (let i = 1; i <= CURRENT_SEASON; i++) {
          try {
            const seasonNumber = String(i).padStart(2, '0');
            const module = await import(`../../data/season${seasonNumber}.json`)??{};


            const candidates =  await getSeasonCandidate(Number(seasonNumber))

            const proposals =  await getSeasonProposals(Number(seasonNumber))
            const nodes =  await getSeasonNodes(Number(seasonNumber))

            module.default.candidates = candidates??[];
            module.default.proposals = proposals?.data??[];
            module.default.nodes = nodes?.data??[];


            const  proposalArr = proposals?.data.filter((d:any) => !!d.applicant).map((d:any) => d.applicant);
            const arr =[...proposalArr,...nodes?.data,...candidates]
            handleSNS([...new Set(arr)]);


            seasonData[i] = module.default;
          } catch (error) {
            console.warn(`Season ${i} data not available:`, error);
          }
        }

        // Filter out seasons with no data
        const filteredData = Object.fromEntries(
          Object.entries(seasonData).filter(([_, value]) => value !== null)
        );

        setData(filteredData);

        // Set the initial selected season to the latest available season
        const seasons = Object.keys(filteredData).map(Number);
        if (seasons.length > 0) {
          setSelectedSeason(Math.max(...seasons));
        }
      } catch (error) {
        console.error('Error loading season data:', error);
        setError('加载数据时发生错误，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    loadSeasonData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  const selectedSeasonData = selectedSeason ? data[selectedSeason] : null;

  return (
    <div className="flex gap-8">
      {/* Left Navigation Panel */}
      <div className="w-64 sticky top-24 h-fit">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">历史会议</h2>
          <nav className="space-y-2">
            {Object.keys(data)
              .map(Number)
              .sort((a, b) => b - a) // Sort in descending order
              .map((season) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                    selectedSeason === season
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700'
                      : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    selectedSeason === season 
                      ? 'bg-primary-500 scale-125' 
                      : 'bg-gray-300 group-hover:bg-gray-400'
                  }`}></span>
                  第{season}季
                </button>
              ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      {selectedSeasonData && (
        <div className="flex-1 space-y-8">
          {/* Season Overview */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">
                第{selectedSeasonData.season}季节点共识大会
              </h1>
              <p className="text-gray-600">
                {dayjs(selectedSeasonData.startDate).format('YYYY年MM月DD日')} - {dayjs(selectedSeasonData.endDate).format('MM月DD日')}
              </p>
            </div>

            {/* Node Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {/* Current Season Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">节点信息</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">节点数量</span>
                    <span className="font-bold text-primary-600">{selectedSeasonData.nodes.length}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">有效SCR要求</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-600">{selectedSeasonData.currentCriteria.validSCR}</span>
                        {selectedSeasonData.currentCriteria.validSCRProposalLink && (
                          <a
                            href={selectedSeasonData.currentCriteria.validSCRProposalLink}
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
                        <span className="font-bold text-primary-600">{selectedSeasonData.currentCriteria.activeSCR}</span>
                        {selectedSeasonData.currentCriteria.activeSCRProposalLink && (
                          <a
                            href={selectedSeasonData.currentCriteria.activeSCRProposalLink}
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
                  <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-gray-200">
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
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">下季节点要求</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">有效SCR要求</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">{selectedSeasonData.nextSeasonCriteria.validSCR}</span>
                      {selectedSeasonData.nextSeasonCriteria.validSCRProposalLink && (
                        <a
                          href={selectedSeasonData.nextSeasonCriteria.validSCRProposalLink}
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
                      <span className="font-bold text-primary-600">{selectedSeasonData.nextSeasonCriteria.activeSCR}</span>
                      {selectedSeasonData.nextSeasonCriteria.activeSCRProposalLink && (
                        <a
                          href={selectedSeasonData.nextSeasonCriteria.activeSCRProposalLink}
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
              </div>
            </div>
          </section>

          {/* Schedule Section */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">会议日程</h2>
            <div className="space-y-6">
              {Object.entries(selectedSeasonData.schedule.reduce((acc, session) => {
                const date = dayjs(session.time).format('YYYY-MM-DD');
                if (!acc[date]) acc[date] = [];
                acc[date].push(session);
                return acc;
              }, {} as Record<string, typeof selectedSeasonData.schedule>)).map(([date, sessions]) => (
                <div key={date} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary-700 mb-4">
                    {dayjs(date).format('YYYY年MM月DD日')}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">时间</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">主题</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">演讲人</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">会议记录</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sessions.map((session, index) => {
                          const recording = selectedSeasonData.recordings.find(r => r.topic === session.topic);
                          return (
                            <tr key={index} className="hover:bg-white transition-colors">
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {dayjs(session.time).format('HH:mm')}
                              </td>
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                {session.topic}
                              </td>
                              <td className="py-3 px-4 text-sm text-primary-600">
                                {session.speaker}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {recording?.video && (
                                    <a
                                      href={recording.video}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-2 py-1 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                                      title="观看回放"
                                    >
                                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                      </svg>
                                    </a>
                                  )}
                                  {recording?.slides && (
                                    <a
                                      href={recording.slides}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-2 py-1 rounded bg-secondary-50 text-secondary-600 hover:bg-secondary-100 transition-colors"
                                      title="查看幻灯片"
                                    >
                                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                      </svg>
                                    </a>
                                  )}
                                  {recording?.article && (
                                    <a
                                      href={recording.article}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-2 py-1 rounded bg-accent-50 text-accent-600 hover:bg-accent-100 transition-colors"
                                      title="阅读文章"
                                    >
                                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 14.584l-4.419 2.23A1 1 0 014 16V4z" clipRule="evenodd" />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Proposals Section */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">提案记录</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {selectedSeasonData.proposals.map((proposal) => (
                <div
                  key={proposal.link}
                  className="bg-gray-50 rounded-lg p-6 transition-all duration-200 group hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="tag tag-primary">{proposal.category}</span>
                    <span className="tag tag-accent">{getStatus(proposal.state!)}</span>
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
                        {!!proposal.applicant && <span className="text-gray-900 font-medium block">
                        {snsMap[proposal.applicant?.toLowerCase()!] ?? truncateAddress(proposal.applicant!)}
                      </span>}
                        <span className="text-sm text-gray-500">提案人</span>
                      </div>
                    </div>
                    <a
                      href={proposal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      查看提案
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showNodesModal}
        onClose={() => setShowNodesModal(false)}
        title="节点列表"
      >
        <div className="space-y-4">
          {selectedSeasonData?.nodes.map((node, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/*<img*/}
                {/*  src={node.avatar}*/}
                {/*  alt={node.sns}*/}
                {/*  className="w-10 h-10 rounded-full"*/}
                {/*/>*/}
                {/*<div>*/}
                  <div className="font-medium text-gray-900"> {snsMap[node.toLowerCase()] ?? truncateAddress(node)}</div>
                  <div className="text-sm text-gray-500 font-mono">
                    {truncateAddress(node)}
                  </div>
                {/*</div>*/}
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
          {selectedSeasonData?.candidates.map((candidate, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-4"
            >
              <div className="font-medium text-gray-900"> {snsMap[candidate.toLowerCase()] ?? truncateAddress(candidate)}</div>
              <div className="text-sm  text-gray-500 font-mono">
                {truncateAddress(candidate)}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
