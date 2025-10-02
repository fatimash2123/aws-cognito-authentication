# React Authentication App with AWS Cognito

A modern React application with comprehensive authentication using AWS Cognito, supporting multiple sign-in methods including email/password and social providers (Google, Facebook, Apple).

## 🚀 Features

- **Multiple Authentication Methods**

  - Email and password authentication
  - Google OAuth integration
  - Facebook OAuth integration
  - Apple Sign-In integration

- **Modern React Architecture**

  - React 18 with TypeScript
  - Vite for fast development and building
  - React Router for navigation
  - Context API for state management

- **Beautiful UI/UX**

  - Tailwind CSS for styling
  - Responsive design
  - Accessible components
  - Loading states and error handling

- **Security & Best Practices**
  - AWS Cognito for secure authentication
  - Protected routes
  - Form validation
  - TypeScript for type safety

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- AWS Account
- Google Cloud Console account (for Google OAuth)
- Facebook Developer account (for Facebook OAuth)
- Apple Developer account (for Apple Sign-In)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cognito
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your AWS Cognito and OAuth provider credentials:

   ```env
   # AWS Cognito Configuration
   VITE_AWS_REGION=us-east-1
   VITE_USER_POOL_ID=us-east-1_XXXXXXXXX
   VITE_USER_POOL_WEB_CLIENT_ID=your-client-id
   VITE_OAUTH_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com

   # OAuth Redirect URLs
   VITE_REDIRECT_SIGN_IN=http://localhost:5173/
   VITE_REDIRECT_SIGN_OUT=http://localhost:5173/

   # Social Provider Client IDs
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_FACEBOOK_CLIENT_ID=your-facebook-client-id
   VITE_APPLE_CLIENT_ID=your-apple-client-id
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── SocialButton.tsx
├── pages/                  # Page components
│   ├── SignUp.tsx
│   ├── SignIn.tsx
│   └── Home.tsx
├── contexts/               # React contexts
│   └── AuthContext.tsx
├── hooks/                  # Custom hooks
│   └── useAuth.ts
├── types/                  # TypeScript type definitions
│   └── auth.ts
├── utils/                  # Utility functions
│   └── cn.ts
├── config/                 # Configuration files
│   └── aws-config.ts
├── App.tsx
└── main.tsx
```

## 🔧 Configuration

### AWS Cognito Setup

1. **Create a User Pool**

   - Go to AWS Cognito Console
   - Create a new user pool
   - Configure sign-in options (Email)
   - Set up password policy
   - Enable self-registration

2. **Configure App Client**

   - Create an app client
   - Enable OAuth 2.0 flows
   - Set up callback URLs
   - Configure OAuth scopes

3. **Set up Social Providers**
   - Configure Google OAuth
   - Configure Facebook OAuth
   - Configure Apple Sign-In
   - Update redirect URIs

For detailed setup instructions, see [AWS Cognito Setup Guide](docs/AWS_COGNITO_SETUP.md).

## 📚 Documentation

- [React Best Practices](docs/REACT_BEST_PRACTICES.md) - Coding standards and patterns
- [Component Architecture](docs/COMPONENT_ARCHITECTURE.md) - Component design patterns
- [AWS Cognito Setup](docs/AWS_COGNITO_SETUP.md) - Detailed setup instructions

## 🎨 UI Components

### Button Component

```tsx
<Button variant='default' size='lg' isLoading={false}>
  Click me
</Button>
```

### Input Component

```tsx
<Input
  label='Email'
  type='email'
  error={errors.email}
  placeholder='Enter your email'
/>
```

### Social Button Component

```tsx
<SocialButton
  provider='google'
  onClick={handleGoogleSignIn}
  isLoading={isLoading}
/>
```

## 🔐 Authentication Flow

1. **Sign Up**

   - User enters email, password, and name
   - Account is created in AWS Cognito
   - User receives verification email
   - Redirected to sign-in page

2. **Sign In**

   - User enters credentials
   - Authentication via AWS Cognito
   - JWT tokens stored securely
   - Redirected to home page

3. **Social Authentication**

   - User clicks social provider button
   - Redirected to provider's OAuth flow
   - Returns with authentication token
   - User is signed in automatically

4. **Protected Routes**
   - Unauthenticated users redirected to sign-in
   - Authenticated users can access protected content
   - Automatic token refresh handling

## 🚀 Deployment

### Environment Variables for Production

Update your production environment variables:

```env
VITE_REDIRECT_SIGN_IN=https://yourdomain.com/
VITE_REDIRECT_SIGN_OUT=https://yourdomain.com/
```

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI

   ```bash
   npm i -g vercel
   ```

2. Deploy

   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard

### Deploy to Netlify

1. Build the project

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Set environment variables in Netlify dashboard

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Test Coverage

```bash
npm run test:coverage
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🛡️ Security Considerations

- **Environment Variables**: Never commit sensitive data
- **HTTPS**: Always use HTTPS in production
- **CORS**: Configure CORS properly for your domain
- **Token Storage**: JWT tokens are stored securely by AWS Amplify
- **Input Validation**: All inputs are validated on both client and server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](docs/AWS_COGNITO_SETUP.md#troubleshooting)
2. Review the [documentation](docs/)
3. Open an issue on GitHub

## 🔄 Updates

### Version 1.0.0

- Initial release
- Email/password authentication
- Social authentication (Google, Facebook, Apple)
- Responsive UI with Tailwind CSS
- TypeScript support
- Comprehensive documentation

## 🙏 Acknowledgments

- [AWS Amplify](https://aws.amazon.com/amplify/) for authentication
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build tool
- [React Router](https://reactrouter.com/) for navigation
