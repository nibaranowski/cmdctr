process.env.SMTP_HOST = 'smtp.test';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'user';
process.env.SMTP_PASS = 'pass';
process.env.EMAIL_FROM = 'test@cmdctr.com';

jest.mock('nodemailer');
import { sendEmail, __test__ } from '../../lib/email';

const nodemailer = require('nodemailer');

// Import after env vars and mock

describe('email utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call nodemailer.sendMail with correct params', async () => {
    const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-id' });
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const params = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test body',
      html: '<b>Test body</b>',
    };

    await sendEmail(params);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
      })
    );
  });
}); 