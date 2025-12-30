export type PlanStatus = 'Drafted' | 'Sent to AM' | 'Approved' | 'Ready';

export const monthlyPlan = {
  id: 'plan-sep',
  month: 'September',
  status: 'Sent to AM' as PlanStatus,
  amNote: 'I’ve selected allocations with strong drink windows and a mix of prestige and value. Let me know if you want more Rhône.'
};
