import AuthForm from '../components/AuthForm.jsx'

function Signup({ onSubmit, onBackLogin, onBackHome }) {
  return (
    <AuthForm
      title="Create your account"
      eyebrow="Join us"
      description="Save favourites, track orders, and checkout faster."
      fields={[
        { label: 'Full name', type: 'text', name: 'name', required: true },
        { label: 'Email', type: 'email', name: 'email', required: true },
        { label: 'Password', type: 'password', name: 'password', required: true },
      ]}
      primaryCta="Sign Up"
      secondaryCta="Back to login"
      onSubmit={onSubmit}
      onSecondary={onBackLogin}
      onBack={onBackHome}
    />
  )
}

export default Signup
