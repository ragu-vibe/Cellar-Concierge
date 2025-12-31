export async function fetchInventory() {
  const response = await fetch('/api/bbr/inventory');
  return response.json();
}

export async function fetchMemberAllocations(memberId: string) {
  const response = await fetch(`/api/bbr/allocations?memberId=${memberId}`);
  return response.json();
}

export async function createDraftOrder(memberId: string, items: Array<{ id: string; quantity: number }>) {
  const response = await fetch('/api/bbr/createDraftOrder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, items })
  });
  return response.json();
}

export async function submitForAMReview(planId: string) {
  const response = await fetch('/api/bbr/submitForAMReview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId })
  });
  return response.json();
}

export async function approvePlan(planId: string, amNote: string, edits: string[]) {
  const response = await fetch('/api/bbr/approvePlan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, amNote, edits })
  });
  return response.json();
}

export async function getPortfolio(memberId: string) {
  const response = await fetch(`/api/bbr/portfolio?memberId=${memberId}`);
  return response.json();
}

export async function createSellIntent(memberId: string, bottleId: string, details: Record<string, string>) {
  const response = await fetch('/api/bbr/createSellIntent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, bottleId, details })
  });
  return response.json();
}
