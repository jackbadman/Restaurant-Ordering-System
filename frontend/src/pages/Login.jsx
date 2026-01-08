// Login page wiring to AuthForm.
import AuthForm from '../components/AuthForm.jsx'

function Login({ onSubmit, onSignup, onBack, notice }) {
  return (
    <AuthForm
      title="Log in to continue"
      eyebrow="Welcome back"
      description="Access your saved favourites, order history, and faster checkout."
      fields={[
        { label: 'Email', type: 'email', name: 'email', required: true },
        { label: 'Password', type: 'password', name: 'password', required: true },
      ]}
      primaryCta="Log In"
      secondaryCta="Sign up"
      notice={notice}
      onSubmit={onSubmit}
      onSecondary={onSignup}
      onBack={onBack}
    />
  )
}

export default Login
