import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, InputNumber } from 'antd'
import AmountFormatter from 'components/AmountFormatter'
import style from './style.module.scss'
// import style from './style.module.scss'

const WalletsSend = () => {
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
        <Input placeholder="Address" />
      </Form.Item>
      <Form.Item
        label="To Address"
        name="toAddress"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <Input size="large" placeholder="Address" />
      </Form.Item>
      <div className="row">
        <div className="col-lg-6">
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber min="1" size="large" placeholder="0.000000" style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div className="col-lg-6">
          <Form.Item
            label="Donate to RAY"
            name="donate"
            tooltip="This donation will be used for further development of RAY Network. Not required."
          >
            <InputNumber min="1" size="large" placeholder="0.000000" style={{ width: '100%' }} />
          </Form.Item>
        </div>
      </div>
      <div className="ray__form__item">
        <div className="ray__form__label">Fee</div>
        <div className="ray__form__amount">
          <AmountFormatter amount={0.181251} ticker={wallet.data.ticker} />
        </div>
      </div>
      <div className="ray__form__item">
        <div className="ray__form__label">Total</div>
        <div className="ray__form__amount">
          <AmountFormatter
            amount={(formValues.amount || 0) + 0.181251}
            ticker={wallet.data.ticker}
            withRate
            large
          />
        </div>
      </div>
      <Form.Item className="pt-3">
        <Button
          htmlType="submit"
          size="large"
          type="primary"
          className={style.btnSend}
          loading={wallet.loading}
        >
          <i className="fe fe-send" />
          <strong>Send {wallet.data.ticker || ''}</strong>
        </Button>
      </Form.Item>
    </Form>
  )
}

export default WalletsSend
