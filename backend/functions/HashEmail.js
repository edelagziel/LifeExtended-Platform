import crypto from 'crypto';

export const handler = async ({ email, choice }) => {
  const pepper = process.env.PEPPER;
  if (!pepper) {
    console.error('PEPPER is not configured');
    throw new Error('PEPPER is not configured');
  }

  console.log('Input validated, hashing email');

  const normalizedEmail = email.trim().toLowerCase();

  const userHash = crypto
    .createHash('sha256')
    .update(normalizedEmail + pepper)
    .digest('hex');

  console.log('HashEmail completed successfully');

  return {
    userHash,
    choice,
  };
};
