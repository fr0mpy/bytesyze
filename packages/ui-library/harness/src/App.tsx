import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Gallery from './Gallery'
import { componentRoutes } from './routes/config'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />}>
          {/* Redirect root to first component */}
          <Route index element={<Navigate to={`/${componentRoutes[0].path}`} replace />} />

          {/* Dynamic routes for each component */}
          {componentRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
