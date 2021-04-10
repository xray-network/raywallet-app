import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button } from 'antd'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
// import style from './style.module.scss'

const WalleMint = () => {
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState(form.getFieldsValue())

  const initialValues = {
    fromAddress: walletParams.accountId,
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
  }, [walletParams.accountId, form])

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
        <div className="row">
          <div className="col-lg-6">
            <Form.Item
              label="Ticker Name"
              name="ticker"
              rules={[{ required: true, message: 'Please enter ticker' }]}
            >
              <Input size="large" placeholder="Ticker" />
            </Form.Item>
          </div>
          <div className="col-lg-6">
            <Form.Item
              label="Mint Amount"
              name="amount"
              rules={[{ required: true, message: 'Please enter amount' }]}
            >
              <Input
                size="large"
                placeholder="Enter Mint Amount"
                autoComplete="off"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label="Wallet ID"
          name="wallet"
          hidden
          initialValue={walletParams.accountId}
          rules={[{ required: true, message: 'Please enter wallet id' }]}
        >
          <Input size="large" placeholder="Address" disabled />
        </Form.Item>
        <Form.Item
          label="Mint Address"
          name="address"
          initialValue={`addr1${walletParams.accountId}`}
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input size="large" placeholder="Address" disabled />
        </Form.Item>
        <div className="ray__item ray__item--success mt-4">
          <div className="row">
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Total</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={0} />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ray__form__item mb-3">
                <div className="ray__form__label">Service Fee</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={0} small />
                </div>
              </div>
              <div className="ray__form__item">
                <div className="ray__form__label">Network Fee</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={0} small />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form.Item className="mt-4">
          <Button
            htmlType="submit"
            size="large"
            disabled
            type="primary"
            className="ray__btn__send w-100"
          >
            <i className="fe fe-upload" />
            <strong>Mint Token</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default WalleMint
