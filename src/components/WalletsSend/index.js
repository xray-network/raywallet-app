import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, InputNumber, Tooltip } from 'antd'
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
      <Input.Group compact className={style.assetGroup}>
        <Form.Item
          className={style.assetAmount}
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please enter amount' }]}
        >
          <InputNumber min="1" size="large" placeholder="0.000000 ADA" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          className={style.assetDonate}
          label="Donate to RAY"
          name="donate"
          tooltip="This donation will be used for further RAY Network development. Not required."
        >
          <InputNumber min="1" size="large" placeholder="0 ADA" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label=" " className={style.assetRemove}>
          <Tooltip title="Remove Token from TX">
            <Button size="large">
              <i className="fe fe-trash-2" />
            </Button>
          </Tooltip>
        </Form.Item>
      </Input.Group>
      <div>
        <Button>
          <i className="fe fe-plus-circle mr-1" />
          Add Token to Tx
        </Button>
      </div>
      <div className={`${style.totals} mt-4`}>
        <div className="row">
          <div className="col-lg-6">
            <div className="ray__form__item">
              <div className="ray__form__label">Total</div>
              <div className="ray__form__amount">
                <AmountFormatter
                  amount={(formValues.amount || 0) + 0.181251}
                  ticker="ADA"
                  withRate
                  large
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ray__form__item">
              <div className="ray__form__label">Fee (inlc. in total)</div>
              <div className="ray__form__amount">
                <AmountFormatter amount={0.181251} ticker="ADA" />
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
