import { isAdminAuthenticated } from './actions'
import { AdminLoginForm } from './admin-login-form'
import { AdminLayoutStyles as S } from './styles'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    return <AdminLoginForm />
  }

  return (
    <div className={S.container}>
      <header className={S.header}>
        <h1 className={S.heading}>Admin</h1>
      </header>
      <main className={S.main}>{children}</main>
    </div>
  )
}
