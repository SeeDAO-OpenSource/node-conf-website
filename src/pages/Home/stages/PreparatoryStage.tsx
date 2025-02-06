import React from 'react';

interface Props {
  season: number;
}

export default function PreparatoryStage({ season }: Props) {
  return (
    <div className="card p-6 bg-gradient-to-r from-indigo-50 to-white border-l-4 border-indigo-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">第{season}季节点共识大会筹备中</h2>
          <p className="text-gray-600">我们正在精心准备下一季度的会议内容，敬请期待</p>
        </div>
        <button
          className="btn btn-primary whitespace-nowrap"
          onClick={() => window.open('https://discord.gg/seedao', '_blank')}
        >
          加入筹备小组
        </button>
      </div>
    </div>
  );
}