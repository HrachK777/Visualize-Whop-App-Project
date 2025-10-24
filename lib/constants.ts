export const customers = [
    { id: 1, name: 'Ethan C Welsh', mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$120', country: 'United States', since: 'Oct 14, 2025', status: 'Active' },
    { id: 2, name: 'MD SHAHID B EMDAD', mrr: '$24', arr: '$288', plan: 'Elite', billing: 'Monthly', payment: '$24', country: 'United States', since: 'Oct 13, 2025', status: 'Active' },
    { id: 3, name: 'Evan Nebab', mrr: '$0.60', arr: '$7.20', plan: 'Advanced', billing: 'Monthly', payment: '$0.60', country: 'United States', since: 'Sep 30, 2025', status: 'Active' },
    { id: 4, name: 'Luis Delpino', mrr: '$12', arr: '$144', plan: 'Elite', billing: 'Monthly', payment: '$12', country: 'United States', since: 'Sep 21, 2025', status: 'Active', note: 'Cancelling in 5 days' },
    { id: 5, name: 'Thien Nguyen', mrr: '$0.60', arr: '$7.20', plan: 'Advanced', billing: 'Monthly', payment: '$0.60', country: 'United States', since: 'Sep 17, 2025', status: 'Active' },
    { id: 6, name: 'Vincent Nicchia', mrr: '$6', arr: '$72', plan: 'Advanced', billing: 'Monthly', payment: '$6', country: 'United States', since: 'Sep 17, 2025', status: 'Active' },
    { id: 7, name: 'Brock Stewart', mrr: '$12', arr: '$144', plan: 'Elite', billing: 'Monthly', payment: '$12', country: 'United States', since: 'Sep 16, 2025', status: 'Active' },
    { id: 8, name: 'Jacob malamud', mrr: '$12', arr: '$144', plan: 'Elite', billing: 'Monthly', payment: '$12', country: 'United States', since: 'Sep 16, 2025', status: 'Active' },
    { id: 9, name: 'Jacob Malamud', mrr: '$12', arr: '$144', plan: 'Elite', billing: 'Monthly', payment: '$12', country: 'United States', since: 'Sep 16, 2025', status: 'Active' },
    { id: 10, name: 'Advaith Malka', mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$132', country: 'United States', since: 'Sep 12, 2025', status: 'Active' },
    { id: 11, name: 'rishi.singh0619@gmail.com', mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$132', country: 'United States', since: 'Sep 11, 2025', status: 'Active' },
    { id: 12, name: 'Patrick Merriman', mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$132', country: 'United States', since: 'Sep 5, 2025', status: 'Active' },
    { id: 13, name: "Trenton O'Neill", mrr: '$120', arr: '$1,440', plan: 'Elite', billing: 'Monthly', payment: '$240', country: 'United States', since: 'Sep 4, 2025', status: 'Active' },
    { id: 14, name: 'Eva Shindin', mrr: '$60', arr: '$720', plan: 'Advanced', billing: 'Monthly', payment: '$120', country: 'United States', since: 'Sep 3, 2025', status: 'Active' },
];

const topWins = [
    { customer: 'Ethan C Welsh', arr: '$1,440', billing: 'Monthly', country: 'United States' },
    { customer: 'MD SHAHID B EMDAD', arr: '$288', billing: 'Monthly', country: 'United States' },
];

const mrrBreakdown = [
    { label: 'New Business MRR', value: '$144', color: 'text-blue-600', count: 2 },
    { label: 'Expansion MRR', value: '$648', color: 'text-blue-500', count: 6 },
    { label: 'Contraction MRR', value: '-$30', color: 'text-red-500', count: 1 },
    { label: 'Churn MRR', value: '-$180', color: 'text-red-600', count: 2 },
    { label: 'Reactivation MRR', value: '$0', color: 'text-gray-500', count: 0 },
];

export const mrrFilterOptions = [
    'All MRR Movements',
    'New Business MRR',
    'Expansion MRR',
    'Churn MRR',
    'Reactivation MRR',
    'Contraction MRR',
];

export const mrrCategories = [
    { key: 'newMRR', label: 'New Business MRR' },
    { key: 'expansionMRR', label: 'Expansion MRR' },
    { key: 'churnedMRR', label: 'Churn MRR' },
    { key: 'reactivations', label: 'Reactivation MRR' },
    { key: 'contractionMRR', label: 'Contraction MRR' },
];

export const churnFilterOptions = [
    'Churn & Retention',
    'Customer Churn Rate',
    'MRR Churn Rate',
    'ARPU',
    'ARPA',
    'LTV',
];

export const churnCategories = [
    { key: 'customerChurnRate', label: 'Customer Churn Rate' },
    { key: 'revenueChurnRate', label: 'MRR Churn Rate' },
    { key: 'arpu', label: 'ARPU' },
    { key: 'arpa', label: 'ARPA' },
    { key: 'ltv', label: 'LTV' },
];

export const leadsFilterOptions = [
    'Leads & Conversions',
    'Leads',
    'Free Trials',
    'Trial→Paid Conversions',
    'Cohorts',
];

export const leadsCategories = [
    { key: 'trialsData.active', label: 'Leads' },
    { key: 'trialsData.active', label: 'Free Trials' },
    { key: 'tiralsData.conversionRate', label: 'Trial→Paid Conversions' },
    { key: 'cohorts', label: 'Cohorts' },
];

export const leads = [
    { id: 1, customer: 'ultdrop@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 2, customer: 'danieljacobdorsey@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 3, customer: 'toxicmula420@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 4, customer: 'directterms@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 5, customer: 'flipacademy@yahoo.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 6, customer: 'newdismain@ixempires.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 7, customer: 'ebaycashcamel@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 8, customer: 'danieljacobdorsey@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 9, customer: 'chernichaw1@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 10, customer: 'monkman9696@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
    { id: 11, customer: 'rothstleo82@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead', note: 'Free subscriber' },
    { id: 12, customer: 'maria.kipling@gmail.com', leadCreated: '—', trialStarted: '—', country: '—', owner: '—', status: 'New Lead' },
];