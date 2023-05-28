import {
  ConfigProvider, theme, Typography,
} from 'antd'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Dashboard } from 'pages'

import { Layout } from './shared/components'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'integrations',
        element: <Typography.Text>Integrations</Typography.Text>,
      },
      {
        path: 'providers',
        children: [
          {
            path: ':spAddress',
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
])

const App = () => (
  <ConfigProvider theme={{
    algorithm: theme.darkAlgorithm,
    components: {
      Layout: {
        colorBgContainer: '#1E2026',
        colorBgHeader: '#1E2026',
      },
      Menu: {
        colorBgBase: '#1E2026',
        colorItemBg: '#1E2026',
        colorSubItemBg: '#18191e',
      },
    },
    token: {
      colorPrimary: '#009E2C',
    },
  }}
  >
    <RouterProvider router={router} />
  </ConfigProvider>
)

export default App
