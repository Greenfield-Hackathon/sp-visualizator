import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import {
  Space, Typography, Row, Col, Spin, Button, Modal,
} from 'antd'
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from 'recharts'
import {
  CheckCircleOutlined, CloseCircleOutlined, IssuesCloseOutlined, PauseCircleOutlined, SettingOutlined,
} from '@ant-design/icons'
import { ethers } from 'ethers'

import { getProvider, getPriceByTime, useProviderStore } from 'entities/provider/model'
import { KPISettings } from 'entities/provider/components'

const Dashboard = () => {
  const { spAddress } = useParams()

  const [isProviderLoading, setIsProviderLoading] = useState(false)
  const [isKPISettingsOpened, setIsKPISettingsOpened] = useState(false)

  const [currentProvider, setCurrentProvider] = useProviderStore(
    (state) => [state.currentProvider, state.setCurrentProvider],
  )

  const [currentProviderPriceByTime, setCurrentProviderPriceByTime] = useProviderStore(
    (state) => [state.currentProviderPriceByTime, state.setCurrentProviderPriceByTime],
  )

  const fetchProvider = useCallback(() => {
    if (!spAddress) { return }

    setIsProviderLoading(true)

    getProvider(spAddress)
      .then(({ storageProvider }) => setCurrentProvider(storageProvider))
      .finally(() => setIsProviderLoading(false))
  }, [setCurrentProvider, spAddress])

  const fetchProviderPriceByTime = useCallback(() => {
    if (!spAddress) { return }

    const currentTimestamp = Math.floor(Date.now() / 1000)

    getPriceByTime(spAddress, currentTimestamp)
      .then(({ sp_storage_price }) => {
        const formattedStoragePrice = {
          ...sp_storage_price,
          update_time_sec: new Date(Number(currentTimestamp) * 1000)
            .toLocaleTimeString(),
        }

        setCurrentProviderPriceByTime(formattedStoragePrice)
      })
  }, [setCurrentProviderPriceByTime, spAddress])

  useEffect(() => {
    fetchProvider()
  }, [fetchProvider])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchProviderPriceByTime()
    }, 2000)

    return () => clearInterval(interval)
  }, [currentProvider, fetchProviderPriceByTime])

  return (
    <Spin size="large" spinning={isProviderLoading}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 20, padding: '0 30px',
      }}
      >
        <Row justify="space-between">
          <Typography.Title level={2} style={{ margin: 0 }}>
            {currentProvider?.description.moniker}
          </Typography.Title>
          <Button icon={<SettingOutlined />} type="primary" onClick={() => setIsKPISettingsOpened(true)}>
            Setting KPI
          </Button>
        </Row>
        <Row gutter={20}>
          <Col>
            <Space
              direction="vertical"
              style={{
                backgroundColor: '#1E2026',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              <Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
                Status
              </Typography.Title>
              <Space>
                {currentProvider && titleByStatus[currentProvider?.status]}
                {currentProvider && iconByStatus[currentProvider?.status]}
              </Space>
            </Space>
          </Col>
          <Col>
            <Space
              direction="vertical"
              style={{
                backgroundColor: '#1E2026',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              <Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
                Endpoint
              </Typography.Title>
              <Space>
                <Typography.Text copyable>
                  {currentProvider?.endpoint}
                </Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space
              direction="vertical"
              style={{
                backgroundColor: '#1E2026',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              <Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
                Operator Address
              </Typography.Title>
              <Space>
                <Typography.Text copyable>
                  {currentProvider?.operator_address}
                </Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space
              direction="vertical"
              style={{
                backgroundColor: '#1E2026',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              <Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
                Total Deposit
              </Typography.Title>
              <Space>
                <Typography.Text strong>
                  {currentProvider && ethers.formatEther(currentProvider.total_deposit)}
                  {' '}
                  BNB
                </Typography.Text>
              </Space>
            </Space>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={24}>
            <Space
              direction="vertical"
              style={{
                width: '100%', height: 400, backgroundColor: '#1E2026', borderRadius: '10px', padding: '20px',
              }}
            >
              <Typography.Title level={3} style={{ padding: 0, margin: 0 }}>
                Price by time
              </Typography.Title>
              <ResponsiveContainer height={300} width="100%">
                <LineChart
                  data={currentProviderPriceByTime}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 10,
                  }}
                >
                  <XAxis dataKey="update_time_sec" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="store_price" stroke="#82ca9d" type="monotone" />
                  <Line dataKey="read_price" stroke="#82ca9d" type="monotone" />
                </LineChart>
              </ResponsiveContainer>
            </Space>
          </Col>
        </Row>
      </div>
      <Modal
        okButtonProps={{ form: 'kpiSettingsForm', htmlType: 'submit' }}
        open={isKPISettingsOpened}
        title="KPI Settings"
        onCancel={() => setIsKPISettingsOpened(false)}
        onOk={() => setIsKPISettingsOpened(false)}
      >
        {currentProvider && (
          <KPISettings spAddress={currentProvider.operator_address} />
        )}
      </Modal>
    </Spin>

  )
}

const iconByStatus = {
  STATUS_IN_SERVICE: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />,
  STATUS_IN_JAILED: <PauseCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />,
  STATUS_GRACEFUL_EXITING: <IssuesCloseOutlined style={{ color: '#52c41a', fontSize: '16px' }} />,
  STATUS_OUT_OF_SERVICE: <CloseCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />,
}

const titleByStatus = {
  STATUS_IN_SERVICE: <Typography.Text strong type="success">IN SERVICE</Typography.Text>,
  STATUS_IN_JAILED: <Typography.Text type="danger">IN JAILED</Typography.Text>,
  STATUS_GRACEFUL_EXITING: <Typography.Text type="warning">GRACEFUL EXITING</Typography.Text>,
  STATUS_OUT_OF_SERVICE: <Typography.Text type="secondary">OUT OF SERVICE</Typography.Text>,
}

export default Dashboard
