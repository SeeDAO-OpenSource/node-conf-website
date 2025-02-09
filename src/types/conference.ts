export type ConferenceStage = 'adjournment' | 'preparatory' | 'meeting';

export interface Node {
  sns: string;
  walletAddress: string;
  avatar?: string;
}

export interface Proposal {
  id: string;
  tag: string;
  status: string;
  title: string;
  category?: string;
  avatar: string;
  applicant: string;
  state?: number;
  proposer?: {
    sns: string;
    avatar?: string;
  };
  link: string;
}

export interface ScheduleSession {
  time: string;
  speaker: string;
  topic: string;
  meetingLink?: string;
}

export interface Recording {
  topic: string;
  video?: string;
  slides?: string;
  article?: string;
}

export interface SeasonCriteria {
  validSCR: number;
  activeSCR: number;
  validSCRProposalLink?: string;
  activeSCRProposalLink?: string;
}

export interface SBTToken {
  contractAddress: string;
  tokenId: string;
  explorerUrl: string;
}

export interface ConferenceData {
  season: number;
  startDate: string; // Conference start date
  endDate: string;   // Conference end date
  sbtToken: SBTToken;
  currentNodes: number;
  currentCriteria: SeasonCriteria;
  nextSeasonCriteria: SeasonCriteria;
  nodes: {
    wallet:string;
    avatar:string;
    name:string;
  }[];
  candidates: string[];
  proposals: Proposal[];
  schedule: ScheduleSession[];
  recordings: Recording[];
  meetingLink?: string;
}
