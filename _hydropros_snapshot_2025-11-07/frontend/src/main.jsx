import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home.jsx'
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
      { path: 'sales', element: <Sales /> },
      { path: 'service', element: <Service /> },
      /*
        CHANGED: The Landing Page route has been
        MOVED out of this "children" array.
      */
    ],
  },
  /*
    CHANGED: The Landing Page is now a top-level route,
    just like your NotFound page. This means it will
    NOT have the MainLayout (header/footer) anymore.
  */
  { path: 'landing', element: <LandingPage /> },
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)