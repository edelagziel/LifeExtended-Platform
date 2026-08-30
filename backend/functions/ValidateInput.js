export const handler = async (event) => {
  console.log('Raw input:', event);

  const { email, choice } = event;

  if (!email || !choice) {
    return {
      status: 'INVALID_INPUT',
      reason: 'Missing email or choice',
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail.includes('@')) {
    return {
      status: 'INVALID_INPUT',
      reason: 'Invalid email format',
    };
  }

  return {
    status: 'SUCCESS',
    email: normalizedEmail,
    choice,
  };
};
