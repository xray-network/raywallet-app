import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, Tooltip, Select, Empty } from 'antd'
import AmountFormatter from 'components/Layout/AmountFormatter'
import style from './style.module.scss'

const WalletSend = () => {
  const walletData = useSelector((state) => state.wallets.walletData)
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const walletLoading = useSelector((state) => state.wallets.walletLoading)
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState(form.getFieldsValue())

  const initialValues = {
    fromAddress: walletData.accountId,
  }

  const onFinish = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = (values) => {
    setFormValues({
      ...formValues,
      ...values,
    })
  }

  useEffect(() => {
    form.resetFields()
  }, [walletData.accountId, form])

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        requiredMark={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="From Address" hidden name="fromAddress" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="To Address"
          name="toAddress"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input size="large" placeholder="Address" allowClear />
        </Form.Item>
        <Input.Group compact className={style.assetGroup}>
          <Form.Item
            className={style.assetTicker}
            label="Token"
            name="fromTicker"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Select
              size="large"
              placeholder="Select"
              notFoundContent={
                <Empty
                  description="No Tokens"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="mt-3 mb-2"
                />
              }
            >
              {walletData.assets &&
                walletData.assets.map((asset, index) => {
                  return (
                    <Select.Option key={index}>
                      <div className={style.assetTo}>
                        <span className={style.assetIcon}>?</span>
                        <span className={style.assetTo}>{asset.ticker}</span>
                      </div>
                    </Select.Option>
                  )
                })}
            </Select>
          </Form.Item>
          <Form.Item
            className={style.assetAmount}
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input
              size="large"
              placeholder="0.000000"
              autoComplete="off"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            className={style.assetDonate}
            label="Donate"
            name="donate"
            tooltip="This donation will be used for further RAY Network development. Not required."
          >
            <Input size="large" placeholder="0" autoComplete="off" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label=" " className={style.assetRemove}>
            <Tooltip title="Remove Token from Tx">
              <Button size="large" disabled>
                <i className="fe fe-trash-2" />
              </Button>
            </Tooltip>
          </Form.Item>
        </Input.Group>
        <div className="mb-4">
          <Button>
            <i className="fe fe-plus-circle mr-1" />
            Add Token to Tx
          </Button>
        </div>
        <div className="ray__item">
          <div className="row">
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Total</div>
                <div className="ray__form__amount">
                  <AmountFormatter amount={0} ticker="ADA" withRate large />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Fee (inlc. in total)</div>
                <div className="ray__form__amount">
                  <AmountFormatter amount={0} ticker="ADA" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form.Item className="mt-4">
          <Button
            htmlType="submit"
            size="large"
            type="primary"
            className="ray__btn__send w-100"
            loading={walletLoading}
            disabled={!walletParams.accountId}
          >
            <i className="fe fe-send" />
            <strong>Send</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default WalletSend
