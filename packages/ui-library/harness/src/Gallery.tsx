import { useState, useEffect, useCallback, Suspense, memo } from 'react'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@bytesyze-ui/core/button'
import { Drawer } from '@bytesyze-ui/core/drawer'
import { useIsMobile } from '@bytesyze-ui/core/hooks'
import { ScrollArea } from '@bytesyze-ui/core/scroll-area'
import { ThemeSwitcher } from '@bytesyze-ui/core/theme-switcher'
import { ComponentErrorBoundary } from './ComponentErrorBoundary'
import { GalleryStyles as S } from './GalleryStyles'
import { componentRoutes, getAdjacentRoutes } from './routes/config'

// Loading fallback for lazy components
const ComponentSkeleton = memo(() => (
  <div className={S.skeleton.container}>
    <div className={S.skeleton.title} />
    <div className={S.skeleton.content} />
  </div>
))
ComponentSkeleton.displayName = 'ComponentSkeleton'

// Shared navigation content for sidebar and mobile drawer
interface SidebarNavProps {
  componentPath: string
  onNavigate?: () => void
}

const SidebarNav = memo(({ componentPath, onNavigate }: SidebarNavProps) => (
  <nav className={S.nav}>
    {componentRoutes.map((route) => (
      <Link
        key={route.path}
        to={`/${route.path}`}
        onClick={onNavigate}
        className={[
          S.navLink.base,
          route.path === componentPath ? S.navLink.active : S.navLink.inactive,
        ].join(' ')}
      >
        {route.name}
      </Link>
    ))}
  </nav>
))
SidebarNav.displayName = 'SidebarNav'

export default function Gallery() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [isDark, setIsDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Extract component path from URL (remove leading slash)
  const componentPath = location.pathname.slice(1) || componentRoutes[0].path

  // Get current route info
  const currentRoute = componentRoutes.find((r) => r.path === componentPath)
  const { previous, next, currentIndex, total } = getAdjacentRoutes(componentPath)

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Close sidebar on navigation (mobile)
  const handleMobileNavigation = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (next) void navigate(`/${next.path}`)
  }, [next, navigate])

  const goToPrevious = useCallback(() => {
    if (previous) void navigate(`/${previous.path}`)
  }, [previous, navigate])

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [])

  const openSidebar = useCallback(() => {
    setSidebarOpen(true)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className={S.container}>
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className={S.sidebar.desktop}>
        <ScrollArea className={S.sidebar.scrollArea}>
          <div className={S.sidebar.headerRow}>
            <h2 className={S.sidebar.title}>Components</h2>
            <ThemeSwitcher isDark={isDark} onToggle={toggleDarkMode} />
          </div>
          <SidebarNav componentPath={componentPath} />
        </ScrollArea>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        open={sidebarOpen && isMobile}
        onClose={closeSidebar}
        title="Components"
        side="left"
      >
        <div className={S.sidebar.drawerHeaderRow}>
          <ThemeSwitcher isDark={isDark} onToggle={toggleDarkMode} />
        </div>
        <SidebarNav componentPath={componentPath} onNavigate={handleMobileNavigation} />
      </Drawer>

      {/* Mobile Menu Trigger */}
      <Button
        variant="secondary"
        size="md"
        className={S.sidebar.mobileTrigger}
        onClick={openSidebar}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Main content */}
      <main className={S.main}>
        <ScrollArea className={S.scrollArea}>
          {/* Header */}
          <header className={S.header.wrapper}>
            <div className={S.header.row}>
              <h1 className={S.header.title}>Component Gallery</h1>
              {/* Theme toggle in header on mobile (sidebar hidden) */}
              <div className={S.header.mobileOnly}>
                <ThemeSwitcher isDark={isDark} onToggle={toggleDarkMode} />
              </div>
            </div>
            <p className={S.header.subtitle}>
              Neumorphic Theme - {total} Components
            </p>
          </header>

          {/* Navigation controls - stack on mobile */}
          <div className={S.navControls.wrapper}>
            <Button
              variant="text"
              onClick={goToPrevious}
              disabled={!previous}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className={S.navControls.buttonText}>Previous</span>
            </Button>
            <span className={S.navControls.title}>
              {currentRoute?.name ?? 'Select a component'}
            </span>
            <Button
              variant="text"
              onClick={goToNext}
              disabled={!next}
            >
              <span className={S.navControls.buttonText}>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Component preview */}
          <div
            data-testid={`component-preview-${currentRoute?.name.toLowerCase() ?? 'empty'}`}
            className={S.preview}
          >
            <ComponentErrorBoundary name={currentRoute?.name ?? 'Component'}>
              <Suspense fallback={<ComponentSkeleton />}>
                <Outlet />
              </Suspense>
            </ComponentErrorBoundary>
          </div>

          {/* Component info */}
          <div className={S.info.wrapper}>
            <p className={S.info.text}>
              Component {currentIndex >= 0 ? currentIndex + 1 : '-'} of {total}
            </p>
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
