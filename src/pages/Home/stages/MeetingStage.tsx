import React, {useEffect, useState} from 'react';
import Countdown from 'react-countdown';
import type { ConferenceData } from '../../../types/conference';
import dayjs from 'dayjs';
import CalendarDropdown from '../../../components/CalendarDropdown';
import Modal from '../../../components/Modal';
import ClaimButton from '../../../components/ClaimButton';
import {getStatus} from "../../../utils/public.ts";
import useQuerySNS from "../../../hooks/useQuerySNS.tsx";
import {truncateAddress} from "../../../utils/address.ts";
import styled from "styled-components";

const Box = styled.div`
  .addeventatc{
    box-shadow: none!important;
    z-index: auto!important;
    position: relative;
    background-color: transparent!important;
  }
  .addeventatc_dropdown{
    z-index: 10!important;
  }
`

interface Props {
  data: ConferenceData;
}

export default function MeetingStage({ data }: Props) {
  const [claimEndTime] = useState(() => Date.now() + 24 * 60 * 60 * 1000);
  const [showClaim, setShowClaim] = useState(true);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [snsMap, setSnsMap] = useState<any>({});

  const { getMultiSNS } = useQuerySNS();

  useEffect(() => {
    // handleSNS(data.proposals.filter((d) => !!d.applicant).map((d) => d.applicant));
    const  proposalArr = data.proposals.filter((d) => !!d.applicant).map((d) => d.applicant);

    const nodesArr = data.nodes.filter((d) => !!d.wallet).map((d) => d.wallet)

    const arr =[...proposalArr,...nodesArr,...data.candidates]
    handleSNS([...new Set(arr)]);
  },[data])

  const handleSNS = async (wallets: string[]) => {
    try{
      const sns_map = await getMultiSNS(wallets);
      setSnsMap(sns_map);
    }catch(error:any){
      console.log(error);
    }

  };

  // Group schedule by date
  const scheduleByDate = data.schedule.reduce((acc, session) => {
    const date = dayjs(session.time).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, typeof data.schedule>);

  // Determine meeting status
  const getMeetingStatus = () => {
    const now = dayjs();
    const startDate = dayjs(data.startDate);
    const endDate = dayjs(data.endDate).endOf('day');

    if (now.isBefore(startDate)) return 'not-started';
    if (now.isAfter(endDate)) return 'ended';
    return 'in-progress';
  };

  const getMeetingButtonContent = () => {
    const status = getMeetingStatus();

    switch (status) {
      case 'not-started':
        return {
          text: '添加到日历',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        };
      case 'in-progress':
        return {
          text: '进入会议室',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )
        };
      case 'ended':
        return {
          text: '会议已结束',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const meetingStatus = getMeetingStatus();
  const buttonContent = getMeetingButtonContent();

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="relative group w-40">
      <div className="relative bg-white rounded-2xl overflow-hidden transform transition-all duration-300 group-hover:scale-105">
        <div className="relative p-8 w-full">
          <div className="relative mb-2">
            <div className="text-6xl font-black text-primary-600 transform transition-transform duration-300 group-hover:scale-110 w-20 text-center mx-auto tabular-nums">
              {String(value).padStart(2, '0')}
            </div>
          </div>
          <div className="relative">
            <div className="text-base font-medium text-gray-600 transform transition-all duration-300 group-hover:text-primary-700 text-center">
              {label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-0 -mx-[calc((100vw-101%)/2)] overflow-x-hidden">
      <section className="relative min-h-[80vh] bg-gray-50 px-[calc((100vw-100%)/2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              第{data.season}季节点共识大会
            </h1>
            <p className="text-2xl text-gray-600 mb-12">
              {dayjs(data.startDate).format('YYYY年MM月DD日 HH:mm')} - {dayjs(data.endDate).format('MM月DD日 HH:mm')}
            </p>

            {/* Claim Section */}
            {showClaim && (
              <div className="relative mt-12 mb-16">
                <div className="relative max-w-2xl mx-auto">
                  <div className="space-y-8">
                    <p className="text-gray-600">成为SeeDAO节点，参与社区治理</p>

                    <div className="flex flex-col items-center gap-6">
                      <ClaimButton
                        contractAddress={data.sbtToken.contractAddress}
                        tokenId={data.sbtToken.tokenId}
                        candidates={data.candidates}
                      />

                      <button
                        onClick={() => setShowCandidatesModal(true)}
                        className="text-primary-600 hover:text-primary-500 transition-colors text-sm underline"
                      >
                        查看候选人名单
                      </button>
                    </div>

                    <div>
                      <p className="text-gray-600 mb-3">剩余认领时间</p>
                      <Countdown
                        date={claimEndTime}
                        onComplete={() => setShowClaim(false)}
                        renderer={({ hours, minutes, seconds }) => (
                          <div className="text-3xl font-bold text-primary-600 inline-flex gap-2 tabular-nums">
                            <span className="bg-white px-4 py-2 rounded-lg w-20 text-center">
                              {String(hours).padStart(2, '0')}
                            </span>
                            <span className="w-4 text-center">:</span>
                            <span className="bg-white px-4 py-2 rounded-lg w-20 text-center">
                              {String(minutes).padStart(2, '0')}
                            </span>
                            <span className="w-4 text-center">:</span>
                            <span className="bg-white px-4 py-2 rounded-lg w-20 text-center">
                              {String(seconds).padStart(2, '0')}
                            </span>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {meetingStatus === 'not-started' && (
              <div className="relative">
                <Countdown
                  date={new Date(data.startDate)}
                  renderer={({ days, hours, minutes, seconds }) => (
                    <div className="relative">
                      <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <CountdownUnit value={days} label="天" />
                        <CountdownUnit value={hours} label="时" />
                        <CountdownUnit value={minutes} label="分" />
                        <CountdownUnit value={seconds} label="秒" />
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="relative bg-white px-[calc((100vw-100%)/2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative flex items-center mb-12">
            <h2 className="text-4xl font-bold w-full text-center text-gray-900">会议日程</h2>
            {data.meetingLink && (
              <div className="absolute right-0">
                {meetingStatus === 'not-started' ? (
                  <CalendarDropdown data={data} />
                ) : (
                  <a
                    href={data.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn ${meetingStatus === 'ended' ? 'btn-secondary cursor-not-allowed' : 'btn-primary'} inline-flex items-center gap-2`}
                    onClick={e => meetingStatus === 'ended' && e.preventDefault()}
                  >
                    {buttonContent.icon}
                    {buttonContent.text}
                  </a>
                )}
              </div>
            )}
          </div>
          <Box className="space-y-6">
            {Object.entries(scheduleByDate).map(([date, sessions]) => (
              <div key={date} className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-700 mb-4">
                  {dayjs(date).format('YYYY年MM月DD日')}
                </h3>
                <div >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">时间</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">主题</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">演讲人</th>
                        <th>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessions.map((session, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {dayjs(session.time).format('HH:mm')}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {session.topic}
                          </td>
                          <td className="py-3 px-4 text-sm text-primary-600">
                            {session.speaker}
                          </td>
                          <td>
                            <div title="Add to Calendar" className="addeventatc" >
                              添加到日历
                              <span className="start">{dayjs(session.time).format('MM/DD/YYYY hh:mm a')}</span>
                              {/*<span className="end">02/22/2025 10:00 AM</span>*/}
                              {/*<span className="timezone">America/Los_Angeles</span>*/}
                              <span className="title">{session.topic}</span>
                              {/*<span className="description">Description of the event</span>*/}
                              {/*<span className="location">Location of the event</span>*/}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </Box>
        </div>
      </section>

      {/* Proposals Section */}
      <section className="relative bg-gray-50 px-[calc((100vw-100%)/2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">当前提案</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.proposals.map((proposal) => (
              <div
                key={proposal.link}
                className="bg-white rounded-lg p-6 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="tag tag-primary group-hover:bg-primary-100 transition-colors">
                    {proposal.category}
                  </span>
                  <span className="tag tag-accent group-hover:bg-accent-100 transition-colors">
                    {getStatus(proposal.state!)}
                  </span>
                </div>
                <h3 className="text-xl font-medium mb-4 text-gray-900 group-hover:text-primary-700 transition-colors">
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
        </div>
      </section>

      {/* Candidates Modal */}
      <Modal
        isOpen={showCandidatesModal}
        onClose={() => setShowCandidatesModal(false)}
        title="节点候选人列表"
      >
        <div className="space-y-4">
          {data.candidates.map((candidate, index) => (
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
