'use client'

import { useActionState } from 'react'
import { authenticateAdmin } from './actions'
import { AdminLayoutStyles as S } from './styles'

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(authenticateAdmin, null)

  return (
    <div className={S.authContainer}>
      <form action={formAction} className={S.authForm}>
        <h1 className={S.authTitle}>Admin Login</h1>
        {state?.error && <p className={S.authError}>{state.error}</p>}
        <label htmlFor="admin-password" className="sr-only">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          placeholder="Enter admin password"
          required
          className={S.authInput}
          aria-label="Admin password"
        />
        <button
          type="submit"
          disabled={isPending}
          className={S.authButton}
        >
          {isPending ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
