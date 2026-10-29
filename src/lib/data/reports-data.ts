import { Report } from '../types';

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-01',
    business_id: 'biz-pk-03',
    reporter_email: 'customer@test.com',
    reason: 'Updated Branch Contact Info',
    details: 'The branch landline phone number has been updated to extension 425.',
    status: 'open',
    created_at: '2025-03-01T12:00:00Z',
  }
];
