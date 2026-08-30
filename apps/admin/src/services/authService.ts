import { signUp, confirmSignUp, signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

/**
 * Auth Service for AWS Cognito
 * מטפל בכל פעולות ההתחברות והאימות
 */

export interface SignUpParams {
  email: string;
  password: string;
}

export interface ConfirmSignUpParams {
  email: string;
  confirmationCode: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * הרשמת משתמש חדש
 * @returns username של המשתמש (email)
 */
export async function authSignUp({ email, password }: SignUpParams) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email.toLowerCase().trim(),
      password,
      options: {
        userAttributes: {
          email: email.toLowerCase().trim(),
        },
        autoSignIn: true, // מאפשר התחברות אוטומטית לאחר אימות
      },
    });

    console.log('Sign up response:', { isSignUpComplete, userId, nextStep });
    
    return {
      success: true,
      username: email.toLowerCase().trim(),
      nextStep,
    };
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
}

/**
 * אימות קוד שנשלח למייל
 */
export async function authConfirmSignUp({ email, confirmationCode }: ConfirmSignUpParams) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: email.toLowerCase().trim(),
      confirmationCode,
    });

    console.log('Confirm sign up response:', { isSignUpComplete, nextStep });

    return {
      success: true,
      isSignUpComplete,
      nextStep,
    };
  } catch (error: any) {
    console.error('Error confirming sign up:', error);
    throw new Error(error.message || 'Failed to confirm sign up');
  }
}

/**
 * התחברות משתמש קיים
 */
export async function authSignIn({ email, password }: SignInParams) {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email.toLowerCase().trim(),
      password,
    });

    console.log('Sign in response:', { isSignedIn, nextStep });

    return {
      success: true,
      isSignedIn,
      nextStep,
    };
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * התנתקות
 */
export async function authSignOut() {
  try {
    await signOut();
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * קבלת משתמש מחובר נוכחי
 */
export async function authGetCurrentUser() {
  try {
    const user = await getCurrentUser();
    console.log('Current user:', user);
    return {
      success: true,
      user,
    };
  } catch (error: any) {
    console.error('Error getting current user:', error);
    return {
      success: false,
      user: null,
    };
  }
}

/**
 * בדיקה אם המשתמש מחובר
 */
export async function authCheckAuth() {
  try {
    const session = await fetchAuthSession();
    const isAuthenticated = !!session.tokens?.accessToken;
    
    if (isAuthenticated) {
      const user = await getCurrentUser();
      return {
        isAuthenticated: true,
        user,
      };
    }
    
    return {
      isAuthenticated: false,
      user: null,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
}
