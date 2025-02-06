import React, { useState, useEffect } from 'react';
import { CONFERENCE_STAGE, CURRENT_SEASON, NEXT_SEASON } from '../../config/stage';
import AdjournmentStage from './stages/AdjournmentStage';
import PreparatoryStage from './stages/PreparatoryStage';
import MeetingStage from './stages/MeetingStage';
import type { ConferenceData } from '../../types/conference';

export default function HomePage() {
  const [currentSeasonData, setCurrentSeasonData] = useState<ConferenceData | null>(null);
  const [nextSeasonData, setNextSeasonData] = useState<ConferenceData | null>(null);
  const [previousSeasonData, setPreviousSeasonData] = useState<ConferenceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic imports for season data
    const loadSeasonData = async () => {
      try {
        // Format season numbers with leading zero
        const currentSeasonFormatted = String(CURRENT_SEASON).padStart(2, '0');
        const nextSeasonFormatted = String(NEXT_SEASON).padStart(2, '0');

        // Load current and next season data first
        const [currentSeasonModule, nextSeasonModule] = await Promise.all([
          import(`../../data/season${currentSeasonFormatted}.json`),
          import(`../../data/season${nextSeasonFormatted}.json`)
        ]);
        
        setCurrentSeasonData(currentSeasonModule.default);
        setNextSeasonData(nextSeasonModule.default);

        // Only try to load previous season data if we're in meeting stage
        if (CONFERENCE_STAGE === 'meeting') {
          try {
            const previousSeasonFormatted = String(CURRENT_SEASON - 1).padStart(2, '0');
            const previousSeasonModule = await import(`../../data/season${previousSeasonFormatted}.json`);
            setPreviousSeasonData(previousSeasonModule.default);
          } catch (error) {
            console.warn('Previous season data not available:', error);
            // Don't set error state for previous season data failure
          }
        }
      } catch (error) {
        console.error('Error loading season data:', error);
        setError('加载数据时发生错误，请稍后再试');
      }
    };

    loadSeasonData();
  }, []);

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

  if (!currentSeasonData || !nextSeasonData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {CONFERENCE_STAGE === 'preparatory' && <PreparatoryStage season={NEXT_SEASON} />}
      {CONFERENCE_STAGE === 'meeting' && (
        <>
          <MeetingStage data={currentSeasonData} />
          {previousSeasonData && (
            <div className="mt-20">
              <AdjournmentStage 
                data={previousSeasonData} 
                nextSeasonData={currentSeasonData}
              />
            </div>
          )}
        </>
      )}
      {CONFERENCE_STAGE === 'adjournment' && (
        <AdjournmentStage 
          data={currentSeasonData} 
          nextSeasonData={nextSeasonData}
        />
      )}
    </div>
  );
}