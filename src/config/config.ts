// Conference stage configuration
// adjournment 休会期
// preparatory 筹备期
// meeting 会议期
export const CONFERENCE_STAGE: 'adjournment' | 'preparatory' | 'meeting' = 'meeting'

// Season configuration
export const CURRENT_SEASON = 12 //当前季度

export const CLAIM_START_AT = new Date('2025-10-23T00:00:00+08:00').getTime() // 节点mint开始时间
export const CLAIM_END_AT = new Date('2025-12-01T00:00:00+08:00').getTime() // 节点mint结束时间

// export const CLAIM_START_AT = new Date('2025-02-22T00:00:00+08:00').getTime() // 节点mint开始时间
// export const CLAIM_END_AT = new Date('2025-02-28T12:00:00+08:00').getTime()
