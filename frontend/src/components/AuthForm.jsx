// Shared auth form layout for login/signup.
function AuthForm({
  title,
  eyebrow,
  description,
  fields,
  primaryCta,
  secondaryCta,
  notice,
  onSubmit,
  onSecondary,
  onBack,
}) {
  return (
    <main className="login">
      <section className="login__card" aria-label={title}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="description">{description}</p>
        {notice && (
          <div className={`login__notice login__notice--${notice.type}`}>
            {notice.message}
          </div>
        )}
        <form className="login__form" onSubmit={onSubmit}>
          {fields.map((field) => (
            <label className="login__label" key={field.name}>
              {field.label}
              <input
                className="login__input"
                type={field.type}
                name={field.name}
                required={field.required}
              />
            </label>
          ))}
          <div className="login__actions">
            <button className="login__submit" type="submit">
              {primaryCta}
            </button>
            {secondaryCta && (
              <button className="login__alt" type="button" onClick={onSecondary}>
                {secondaryCta}
              </button>
            )}
          </div>
        </form>
        <button className="login__back" type="button" onClick={onBack}>
          ← Back to home
        </button>
      </section>
    </main>
  )
}

export default AuthForm
