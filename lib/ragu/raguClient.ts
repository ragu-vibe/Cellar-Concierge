import { PlanInput } from '@/lib/ai/simulatedAi';

export async function generatePlan(input: PlanInput) {
  const response = await fetch('/api/ragu/generatePlan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return response.json();
}

export async function summarizeForAM(input: PlanInput) {
  const response = await fetch('/api/ragu/summarizeForAM', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return response.json();
}

export async function recommendSubstitutes(input: PlanInput) {
  const response = await fetch('/api/ragu/recommendSubstitutes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return response.json();
}
