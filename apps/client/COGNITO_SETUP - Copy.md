# AWS Cognito Integration Guide

## Setup Complete!

Your application is now connected to AWS Cognito authentication.

## What Was Done

### 1. Installed Packages
```bash
npm install aws-amplify @aws-amplify/ui-react
```

### 2. Configured Amplify (main.jsx)
```javascript
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_hNKfDgfvm",
      userPoolClientId: "3obrh7pt768esr9hhcnrmicajt",
    },
  },
});
```

### 3. Created Authentication Pages
- **Login Page** (`/login`) - Sign in with existing account
- **Register Page** (`/register`) - Create new account

### 4. Updated Routes
- Default route: `/` → `/login`
- Public routes: `/login`, `/register`
- Protected routes: `/home`, `/form`, `/survey`, `/api`

## How It Works

### Registration Flow
1. User fills registration form (email + password)
2. Cognito creates account
3. **Email verification required** - User receives verification email
4. After verification, user can login

### Login Flow
1. User enters email + password
2. Cognito authenticates
3. User redirected to `/home`
4. Email saved in UserContext for global access

## Password Requirements

Cognito default password policy:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Note:** You can change this in AWS Cognito Console > User Pools > Password Policy

## Error Handling

The forms handle common Cognito errors:

### Registration Errors
- `UsernameExistsException` - Email already registered
- `InvalidPasswordException` - Password doesn't meet requirements
- `InvalidParameterException` - Invalid email format

### Login Errors
- `UserNotFoundException` - Email not found
- `NotAuthorizedException` - Wrong password
- `UserNotConfirmedException` - Email not verified yet

## Testing

### Test User Creation
1. Go to `/register`
2. Enter email: `test@example.com`
3. Enter password: `Test123!@#`
4. Check email for verification link
5. Click verification link
6. Go to `/login`
7. Login with same credentials

### AWS Console Verification
You can verify users in AWS Console:
1. Go to AWS Cognito > User Pools
2. Select your pool: `eu-west-1_hNKfDgfvm`
3. Go to "Users" tab
4. See all registered users

## Next Steps (Optional)

### 1. Add Email Verification Page
Create a page to handle email verification codes:
```javascript
import { confirmSignUp } from "aws-amplify/auth";

await confirmSignUp({
  username: email,
  confirmationCode: code,
});
```

### 2. Add Password Reset
```javascript
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";

// Step 1: Request reset
await resetPassword({ username: email });

// Step 2: Confirm with code
await confirmResetPassword({
  username: email,
  confirmationCode: code,
  newPassword: newPassword,
});
```

### 3. Add Logout Functionality
```javascript
import { signOut } from "aws-amplify/auth";

await signOut();
```

### 4. Get Current User
```javascript
import { getCurrentUser } from "aws-amplify/auth";

const user = await getCurrentUser();
console.log(user);
```

### 5. Session Management
```javascript
import { fetchAuthSession } from "aws-amplify/auth";

const session = await fetchAuthSession();
console.log(session.tokens); // JWT tokens
```

## Useful Links

- [Amplify Auth Documentation](https://docs.amplify.aws/react/build-a-backend/auth/)
- [AWS Cognito Console](https://console.aws.amazon.com/cognito)
- [Cognito User Pool ID](https://console.aws.amazon.com/cognito/v2/idp/user-pools/eu-west-1_hNKfDgfvm/users)

## Troubleshooting

### Issue: "User is not confirmed"
**Solution:** Check email for verification link or manually confirm in AWS Console

### Issue: "Password does not conform to policy"
**Solution:** Use stronger password (8+ chars, uppercase, lowercase, number, special char)

### Issue: "Network error"
**Solution:** Check AWS Cognito User Pool is active and region is correct

### Issue: "Invalid client credentials"
**Solution:** Verify `userPoolClientId` in main.jsx matches AWS Console

## Security Notes

- Never commit AWS credentials to git
- Use environment variables for sensitive config
- Enable MFA for production
- Set up proper CORS in AWS Console
- Use HTTPS in production

## Support

For issues with AWS Cognito setup, contact AWS Support or check:
- AWS Cognito CloudWatch logs
- Browser console for detailed errors
- Network tab for API call failures
