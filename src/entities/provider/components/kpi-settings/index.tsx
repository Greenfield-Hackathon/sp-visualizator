import {
  Form, Input, InputNumber, Select,
} from 'antd'
import { Formik } from 'formik'

import { updateProviderKPISettings, useProviderStore } from 'entities/provider/model'

interface Props {
  spAddress: string
}

const KPISettings = ({ spAddress }: Props) => {
  const [currentProviderKPISettings] = useProviderStore(store => [store.currentProviderKPISettings])

  return (
    <Formik
      initialValues={currentProviderKPISettings}
      onSubmit={(values) => updateProviderKPISettings(
        spAddress,
        values,
        'https://discord.com/api/webhooks/1112333502533337118/FgeSj1k5swBNkS_D9DHo9PdswP9P3iTXDucC7a59XMBnD7h-R5wn8zc1DKm922Db7z5E',
      )}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <Form id="kpiSettingsForm" layout="vertical" style={{ marginTop: 20 }} onFinish={handleSubmit}>
          <Form.Item label="Read Price">
            <InputNumber
              min="0"
              step="0.01"
              value={values.readPrice}
              onChange={(value) => setFieldValue('readPrice', value)}
            />
          </Form.Item>
          <Form.Item label="Store Price">
            <InputNumber
              min="0"
              step="0.01"
              value={values.storePrice}
              onChange={(value) => setFieldValue('storePrice', value)}
            />
          </Form.Item>
          <Form.Item label="Status of SP">
            <Select
              options={[
                {
                  label: 'IN SERVICE',
                  value: 'STATUS_IN_SERVICE',
                },
                {
                  label: 'OUT OF SERVICE',
                  value: 'STATUS_OUT_OF_SERVICE',
                },
                {
                  label: 'IN JAILED',
                  value: 'STATUS_IN_JAILED',
                },
                {
                  label: 'GRACEFUL EXITING',
                  value: 'STATUS_GRACEFUL_EXITING',
                },
              ]}
              value={values.status}
              onChange={(value) => setFieldValue('status', value)}
            />
          </Form.Item>
          <Form.Item label="Discord Webhook">
            <Input />
          </Form.Item>
        </Form>
      )}
    </Formik>
  )
}

export default KPISettings
