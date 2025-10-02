import { Amplify } from 'aws-amplify';

// AWS Cognito Configuration
// Replace these values with your actual AWS Cognito configuration
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId:
        import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID || 'your-client-id',
      loginWith: {
        oauth: {
          domain:
            import.meta.env.VITE_OAUTH_DOMAIN ||
            'your-domain.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [
            import.meta.env.VITE_REDIRECT_SIGN_IN || 'http://localhost:5173/',
          ],
          redirectSignOut: [
            import.meta.env.VITE_REDIRECT_SIGN_OUT || 'http://localhost:5173/',
          ],
          responseType: 'code',
        },
        email: true,
      },
    },
  },
};

// Configure Amplify
Amplify.configure(awsConfig);

export default awsConfig;
