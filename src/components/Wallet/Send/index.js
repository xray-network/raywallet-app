import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, InputNumber, Tooltip } from 'antd'
import AmountFormatter from 'components/Layout/AmountFormatter'
import style from './style.module.scss'
// import style from './style.module.scss'

const WalletSend = () => {
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

  const inputParser = (number) => {
    const reg = /^-?\d*(\.\d*)?$/
    if (reg.test(number) || number === '') {
      return number
    }
    return ''
  }

  useEffect(() => {
    form.resetFields()
  }, [wallet.selected, form])

  return (
    <div>
      <div className="ray__heading">Send transaction</div>
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
          <Input size="large" placeholder="Address" />
        </Form.Item>
        <Input.Group compact className={style.assetGroup}>
          <Form.Item
            className={style.assetAmount}
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              min="1"
              size="large"
              placeholder="0.000000 ADA"
              parser={(number) => inputParser(number)}
              style={{ width: '100%' }}
            />
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
            <Tooltip title="Remove Token from Tx">
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
        {formValues.amount}
        <div className="ray__totals mt-4">
          <div className="row">
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Total</div>
                <div className="ray__form__amount">
                  <AmountFormatter
                    // amount={(Number.isNaN(formValues.amount) ? 0 : formValues.amount) + (Number.isNaN(formValues.donate) ? 0 : formValues.donate) + 0.181251}
                    amount={100}
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
    </div>
  )
}

export default WalletSend
