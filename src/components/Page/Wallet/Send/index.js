import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Select, Empty, Tooltip } from 'antd'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AssetImage from 'components/Layout/AssetImage'
import style from './style.module.scss'

const WalletSend = () => {
  const dispatch = useDispatch()
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const walletLoading = useSelector((state) => state.wallets.walletLoading)
  const transactionLoading = useSelector((state) => state.transactions.transactionLoading)
  const [form] = Form.useForm()

  const initialValues = {
    toAddress: 'addr_test1qracwxsrckgz6e4yjdy3h9h4ze8e8xzsl568dljm883gvf0gl9lhqelxxjhgxrlxzuhv52d7uxj05z2mw0fsqwt3pz4sz0c6yu',
    value: 40,
  }

  const onFinish = (values) => {
    dispatch({
      type: 'transactions/BUILD_TX',
      payload: {
        ...values,
        type: 'send',
      },
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
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
      >
        <Form.Item
          label="To Address"
          name="toAddress"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input size="large" placeholder="Address" allowClear autoComplete="off" />
        </Form.Item>
        <Input.Group compact className={style.assetGroup}>
          <Form.Item
            className={style.assetTickerAda}
            label="Token"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Select
              size="large"
              placeholder="Select"
              disabled
              value="ada"
              notFoundContent={
                <Empty
                  description="No Tokens"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="mt-3 mb-2"
                />
              }
            >
              <Select.Option value="ada">
                <div className={style.assetTo}>
                  <span className={style.assetIcon}>
                    <AssetImage fingerprint="ada" />
                  </span>
                  <span className={style.assetName}>ADA</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            className={style.assetAmountAda}
            label="Amount"
            name="value"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input
              size="large"
              placeholder="0.000000"
              autoComplete="off"
              style={{ width: '100%' }}
              allowClear
            />
          </Form.Item>
        </Input.Group>
        {/* <Input.Group compact className={style.assetGroup}>
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
              <Select.Option value="ada">
                <div className={style.assetTo}>
                  <span className={style.assetIcon}>
                    <AssetImage fingerprint="ada" />
                  </span>
                  <span className={style.assetName}>ADA</span>
                </div>
              </Select.Option>
              {walletAssetsSummary.tokens.map((token) => {
                return (
                  <Select.Option key={token.fingerprint} value={token.fingerprint}>
                    <div className={style.assetTo}>
                      <span className={style.assetIcon}>
                        <AssetImage fingerprint={token.fingerprint} />
                      </span>
                      <span className={style.assetName}>{token.ticker}</span>
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
          <Form.Item label=" " className={style.assetRemove}>
            <Tooltip title="Remove Token from Tx">
              <Button size="large" disabled>
                <i className="fe fe-trash-2" />
              </Button>
            </Tooltip>
          </Form.Item>
        </Input.Group> */}
        <div className="mb-4">
          <Tooltip placement="right" title="Soon">
            <Button>
              <i className="fe fe-plus-circle mr-1" />
              Add Token to Tx
            </Button>
          </Tooltip>
        </div>
        <div className="ray__item ray__item--success">
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
              <div className="ray__form__item">
                <div className="ray__form__label">Fee (inlc. in total)</div>
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
            type="primary"
            className="ray__btn__send w-100"
            loading={(walletLoading || transactionLoading)}
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
