import { UserSchema } from '../../models/User';

describe('User Model', () => {
  const validUser = {
    id: 'u1',
    name: 'Jane Doe',
    email: 'jane@acme.com',
    avatar_url: 'https://cdn.com/avatar.png',
    roles: ['founder'],
    last_login: new Date().toISOString(),
    company_id: 'c1',
  };

  it('validates a correct user object', () => {
    expect(UserSchema.parse(validUser)).toBeTruthy();
  });

  it('rejects invalid email', () => {
    const user = { ...validUser, email: 'not-an-email' };
    expect(() => UserSchema.parse(user)).toThrow();
  });

  it('rejects invalid avatar_url', () => {
    const user = { ...validUser, avatar_url: 'not-a-url' };
    expect(() => UserSchema.parse(user)).toThrow();
  });

  it('rejects missing required fields', () => {
    const { name, ...user } = validUser;
    expect(() => UserSchema.parse(user)).toThrow();
  });

  it('rejects invalid last_login format', () => {
    const user = { ...validUser, last_login: 'not-a-date' };
    expect(() => UserSchema.parse(user)).toThrow();
  });
});
