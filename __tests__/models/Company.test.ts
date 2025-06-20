import { CompanySchema } from '../../models/Company';

describe('Company Model', () => {
  it('validates a correct company object', () => {
    const company = {
      id: 'c1',
      name: 'Acme Inc',
      status: 'active',
      plan: 'pro',
      integrations: [],
      created_at: new Date().toISOString(),
    };
    expect(CompanySchema.parse(company)).toBeTruthy();
  });

  it('rejects invalid status', () => {
    const company = {
      id: 'c2',
      name: 'Bad Inc',
      status: 'unknown',
      plan: 'pro',
      integrations: [],
      created_at: new Date().toISOString(),
    };
    expect(() => CompanySchema.parse(company)).toThrow();
  });

  it('rejects missing required fields', () => {
    const company = {
      id: 'c3',
      name: 'No Plan Inc',
      status: 'active',
      integrations: [],
      created_at: new Date().toISOString(),
    };
    expect(() => CompanySchema.parse(company)).toThrow();
  });

  it('rejects invalid created_at format', () => {
    const company = {
      id: 'c4',
      name: 'Bad Date Inc',
      status: 'active',
      plan: 'pro',
      integrations: [],
      created_at: 'not-a-date',
    };
    expect(() => CompanySchema.parse(company)).toThrow();
  });
});
