import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, InputNumber } from 'antd'
import AmountFormatter from 'components/Layout/AmountFormatter'
import style from './style.module.scss'
// import style from './style.module.scss'

const KickStartCreateToken = () => {
  const wallet = useSelector((state) => state.wallets.wallet)
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState(form.getFieldsValue())

  const initialValues = {
    fromAddress: wallet.selected,
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
  }, [wallet.selected, form])

  return (
    <div>
      <div className="ray__heading">Token Parameters</div>
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
              <InputNumber
                min="1"
                size="large"
                placeholder="Enter Mint Amount"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label="Wallet ID"
          name="wallet"
          hidden
          initialValue={wallet.selected}
          rules={[{ required: true, message: 'Please enter wallet id' }]}
        >
          <Input size="large" placeholder="Address" disabled />
        </Form.Item>
        <Form.Item
          label="Mint Address"
          name="address"
          initialValue={`addr1${wallet.selected}`}
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input size="large" placeholder="Address" disabled />
        </Form.Item>
        <div className="ray__item ray__item--tinted mt-4">
          <div className="row">
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Total</div>
                <div className="ray__form__amount">
                  <AmountFormatter
                    // amount={(Number.isNaN(formValues.amount) ? 0 : formValues.amount) + (Number.isNaN(formValues.donate) ? 0 : formValues.donate) + 0.181251}
                    amount={300.181251}
                    ticker="ADA"
                    withRate
                    large
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ray__form__item mb-3">
                <div className="ray__form__label">Service Fee</div>
                <div className="ray__form__amount">
                  <AmountFormatter amount={300} ticker="ADA" />
                </div>
              </div>
              <div className="ray__form__item">
                <div className="ray__form__label">Network Fee</div>
                <div className="ray__form__amount">
                  <AmountFormatter amount={0.181251} ticker="ADA" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form.Item className="mt-4">
          <Button htmlType="submit" size="large" type="primary" className={style.btnSend}>
            <i className="fe fe-plus-circle" />
            <strong>Create Token</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default KickStartCreateToken
