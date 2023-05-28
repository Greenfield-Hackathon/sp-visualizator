import { useCallback, useEffect } from 'react'
import {
  Menu, Layout as AntdLayout, Typography, Row,
} from 'antd'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { ApartmentOutlined, SettingOutlined } from '@ant-design/icons'

import { useProviderStore, getProviders } from 'entities/provider/model'

const { Sider, Content } = AntdLayout

const Layout = () => {
  const navigate = useNavigate()
  const { spAddress } = useParams()

  const [providers, setProviders] = useProviderStore((state) => [state.providers, state.setProviders])

  const fetchProviders = useCallback(() => {
    getProviders()
      .then(({ sps }) => { setProviders(sps) })
  }, [setProviders])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  const renderMenuItems = () => {
    const providersMenuItems = providers.map((provider) => ({
      key: provider.operator_address,
      label: provider.description.moniker,
    }))

    return [
      {
        key: 'providers',
        label: 'Providers',
        children: providersMenuItems,
        icon: <ApartmentOutlined />,
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: <SettingOutlined />,
      },
    ]
  }

  const handleMenuClick = ({ keyPath }: { keyPath: Array<string>}) => {
    navigate(keyPath.reverse()
      .join('/'))
  }

  const defaultSelectedKeys = spAddress ? [spAddress] : []

  return (
    <AntdLayout>
      <Sider>
        <Menu
          defaultOpenKeys={['providers']}
          defaultSelectedKeys={defaultSelectedKeys}
          items={renderMenuItems()}
          mode="inline"
          theme="dark"
          onClick={handleMenuClick}
        />
      </Sider>
      <Content style={{ height: '100vh', backgroundColor: '#14151A' }}>
        <Row justify="end" style={{ padding: '15px 20px', gap: '10px' }}>
          <Typography.Text>Notifications</Typography.Text>
          <Typography.Text>Account</Typography.Text>
        </Row>
        <Outlet />
      </Content>
    </AntdLayout>
  )
}

export default Layout
