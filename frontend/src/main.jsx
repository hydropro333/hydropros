import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Gallery from './pages/Gallery.jsx'
import Sales from './pages/Sales.jsx'
import Service from './pages/Service.jsx'
import LandingPage from './pages/LandingPage.jsx'
import NotFound from './pages/NotFound.jsx'
import './styles/global.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'sales', element: <Sales /> },
    ],
  },
  // Service/Landing page without MainLayout header/footer
  { path: 'service', element: <LandingPage /> },
  { path: 'hydropros', element: <Navigate replace to="/service" /> },
  { path: 'landing', element: <Navigate replace to="/service" /> },
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
