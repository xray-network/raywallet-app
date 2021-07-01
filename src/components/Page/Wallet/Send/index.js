import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Select, Empty, Tooltip, Alert } from 'antd'
import { debounce } from 'lodash'
import BigNumber from 'bignumber.js'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AssetImage from 'components/Layout/AssetImage'
import style from './style.module.scss'

const WalletSend = () => {
  const dispatch = useDispatch()
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const walletLoading = useSelector((state) => state.wallets.walletLoading)
  const transactionLoading = useSelector((state) => state.transactions.transactionLoading)
  const transaction = useSelector((state) => state.transactions.transaction)
  const walletAssetsSummary = useSelector((state) => state.wallets.walletAssetsSummary)
  const { tokens } = walletAssetsSummary

  const [hasErrors, setHasErrors] = useState(false)
  const [form] = Form.useForm()

  const onFinish = () => {
    const touched = form.isFieldsTouched()
    if (hasErrors || !touched) {
      if (!touched) {
        form.validateFields()
      }
      return
    }
    const values = form.getFieldsValue()
    dispatch({
      type: 'transactions/BUILD_TX',
      payload: {
        ...values,
        type: 'send',
      },
    })
  }

  useEffect(() => {
    form.resetFields()
  }, [walletParams.accountId, form])

  const handleOnChange = () => {
    const values = form.getFieldsValue()
    dispatch({
      type: 'transactions/BUILD_TX',
      payload: {
        ...values,
        type: 'calculate',
      },
    })
  }

  useEffect(() => {
    const values = form.getFieldsValue()
    const isError = transaction instanceof Error
    if (isError) {
      setHasErrors(true)
      const getErrorString = (key) => {
        const mapKeys = {
          ada_not_enough: 'value',
          ada_less_than_min: 'value',
          ada_not_number: 'value',
          ada_wrong_value: 'value',
          address_wrong: 'toAddress',
        }
        if (mapKeys[transaction.type] === key) {
          return [transaction.message]
        }
        return []
      }
      const valueKeys = Object.keys(values)
      const newFields = valueKeys.map((key) => {
        return {
          name: key,
          value: values[key],
          errors: getErrorString(key),
        }
      })
      form.setFields(newFields)
    } else {
      setHasErrors(false)
      const valueKeys = Object.keys(values)
      if (!Object.keys(transaction).length) {
        form.resetFields()
        return
      }
      const newFields = valueKeys.map((key) => {
        return {
          name: key,
          value: values[key],
          errors: [],
        }
      })
      form.setFields(newFields)
    }
  }, [transaction, form])

  useLayoutEffect(() => {
    return () => {
      dispatch({
        type: 'transactions/CLEAR_TX',
      })
    }
  }, [dispatch])

  const isError = transaction instanceof Error
  const totalIsNan = new BigNumber(transaction.value).plus(transaction.fee).isNaN()
  const feeIsNan = new BigNumber(transaction.fee).isNaN()
  const total =
    isError || totalIsNan ? '0' : new BigNumber(transaction.value).plus(transaction.fee).toFixed()
  const fee = isError || feeIsNan ? '0' : new BigNumber(transaction.fee).toFixed()

  return (
    <div>
      {!!tokens.length && (
        <div className="mb-3">
          <Alert
            type="error"
            message={
              <div>
                Outgoing transactions from wallets with native tokens are currently not supported.
                Please use Yoroi temporarily.{' '}
                <a href="https://rraayy.com/updates" target="_blank" rel="noopener noreferrer">
                  Status →
                </a>
              </div>
            }
          />
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onChange={debounce(handleOnChange, 500)}
      >
        <Form.Item
          label="To Address"
          name="toAddress"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input
            size="large"
            placeholder="Address (Shelley format)"
            allowClear
            autoComplete="off"
          />
        </Form.Item>
        <Input.Group compact className={style.assetGroup}>
          <Form.Item
            className={style.assetTickerAda}
            label="Asset"
            // rules={[{ required: true, message: 'Required' }]}
          >
            <Select
              size="large"
              placeholder="Select"
              disabled
              value="ada"
              notFoundContent={
                <Empty
                  description="No Asset"
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
            <Tooltip title="Remove Asset from Tx">
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
              Add Asset to Tx
            </Button>
          </Tooltip>
        </div>
        <div className="ray__item ray__item--success">
          <div className="row">
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Total</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={total} />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Fee (inlc. in total)</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={fee} small />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form.Item className="mt-4">
          <Button
            onClick={onFinish}
            size="large"
            type="primary"
            className="ray__btn__send w-100"
            loading={walletLoading || transactionLoading}
            disabled={!walletParams.accountId || !!tokens.length}
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
