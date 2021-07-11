import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, InputNumber, Button, Select, Empty, Alert } from 'antd'
import { debounce } from 'lodash'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AmountFormatterAsset from 'components/Layout/AmountFormatterAsset'
import AssetImage from 'components/Layout/AssetImage'
import style from './style.module.scss'

const WalletSend = () => {
  // global data
  const dispatch = useDispatch()
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const walletLoading = useSelector((state) => state.wallets.walletLoading)
  const transactionLoading = useSelector((state) => state.transactions.transactionLoading)
  const { tokens } = useSelector((state) => state.wallets.walletAssetsSummary)
  const transactionData = useSelector((state) => state.transactions.transactionData)
  const [hasError, setHasError] = useState(false)
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
  }, [walletParams.accountId, form])

  useEffect(() => {
    if (!Object.keys(transactionData).length) {
      form.resetFields()
      return
    }
    if (transactionData.error) {
      if (typeof transactionData.error === 'object') {
        setHasError(transactionData.error.message)
      } else {
        // transform lovelaces to adas
        setHasError(
          transactionData.error
            .replace(/\'/g, '')
            .split(/(\d+)/)
            .map((item) => {
              const number = parseInt(item, 10)
              return Number.isNaN(number) ? item : `${(number / 1000000).toFixed(6)} ADA`
            })
            .join(' '),
        )
      }
    } else {
      setHasError()
    }
    // eslint-disable-next-line
  }, [transactionData])

  const transformOutputs = (values) => {
    const outputs = []

    values.forEach(({ address, value, tokens: outputTokens }) => {
      if (address || value) {
        const result = {
          ...(address && { address }),
          ...(value && { value: (value * 1000000).toString() }),
        }

        if (outputTokens && outputTokens.length > 0) {
          result.tokens = []
          outputTokens.forEach((token) => {
            if (token.assetId && token.quantity) {
              const filtered = tokens.filter((item) => item.assetId === token.assetId)[0]
              const resultToken = {
                quantity: token.quantity ? token.quantity.toString() : '0',
                asset: {
                  assetId: filtered.assetId || 'wrong',
                  policyId: filtered.policyId,
                  assetName: filtered.assetName,
                },
              }
              result.tokens.push(resultToken)
            }
          })
        }

        outputs.push(result)
      }
    })

    return outputs
  }

  const onFinish = () => {
    const touched = form.isFieldsTouched()
    const hasValidationError = !!form.getFieldsError().filter(({ errors }) => errors.length).length
    if (hasError || !touched || hasValidationError) {
      return
    }

    const values = form.getFieldsValue()
    const outputs = transformOutputs(values.outputs)

    if (outputs.length) {
      dispatch({
        type: 'transactions/BUILD_TX',
        payload: {
          outputs,
          type: 'send',
        },
      })
    }
  }

  const handleOnChange = () => {
    setShouldUpdate(true)
    const values = form.getFieldsValue()
    const outputs = transformOutputs(values.outputs)

    if (outputs.length) {
      dispatch({
        type: 'transactions/BUILD_TX',
        payload: {
          outputs,
          type: 'calculate',
        },
      })
    }
  }

  const handleRemove = () => {
    if (shouldUpdate) {
      setTimeout(() => {
        handleOnChange()
      }, 100)
    }
  }

  return (
    <div>
      <Form
        onFinish={() => onFinish()}
        form={form}
        layout="vertical"
        requiredMark={false}
        preserve={false}
      >
        <Form.List name="outputs" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                return (
                  <div key={field.key}>
                    <Form.Item>
                      <div>
                        {field.key > 0 && (
                          <a
                            onClick={() => {
                              remove(field.name)
                              handleRemove()
                            }}
                            onKeyPress={() => {
                              remove(field.name)
                              handleRemove()
                            }}
                            role="button"
                            tabIndex="0"
                            className={style.removeOutput}
                          >
                            <span>Remove</span> <i className="fe fe-x-circle" />
                          </a>
                        )}
                        <div className="ray__form__label">To Address</div>
                      </div>
                      <Form.Item
                        {...field.restField}
                        name={[field.name, 'address']}
                        fieldKey={[field.fieldKey, 'address']}
                        rules={[{ required: true, message: 'Required' }]}
                        noStyle
                        initialValue=""
                      >
                        <Input
                          size="large"
                          placeholder="Address"
                          allowClear
                          autoComplete="off"
                          addonBefore={<i className="fe fe-arrow-right" />}
                          onChange={debounce(handleOnChange, 500)}
                        />
                      </Form.Item>
                    </Form.Item>
                    <Input.Group compact className={style.assetGroup}>
                      <Form.Item
                        {...field.restField}
                        className={style.assetTickerAda}
                        rules={[{ required: true, message: 'Required' }]}
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
                        name={[field.name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        initialValue=""
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <InputNumber
                          type="number"
                          step="1"
                          min="1"
                          precision={6}
                          size="large"
                          placeholder="0.000000"
                          autoComplete="off"
                          style={{ width: '100%' }}
                          // allowClear
                          onChange={debounce(handleOnChange, 500)}
                        />
                      </Form.Item>
                    </Input.Group>
                    <Form.List name={[field.name, 'tokens']}>
                      {(tokenFields, { add: tokenAdd, remove: tokenRemove }) => (
                        <>
                          {tokenFields.map((tokenField) => {
                            return (
                              <Input.Group
                                key={tokenField.key}
                                compact
                                className={style.assetGroup}
                              >
                                <Form.Item
                                  className={style.assetTicker}
                                  name={[tokenField.name, 'assetId']}
                                  fieldKey={[tokenField.fieldKey, 'assetId']}
                                  rules={[{ required: true, message: 'Required' }]}
                                >
                                  <Select
                                    size="large"
                                    placeholder="Select"
                                    onChange={debounce(handleOnChange, 500)}
                                    notFoundContent={
                                      <Empty
                                        description="No Tokens"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        className="mt-3 mb-2"
                                      />
                                    }
                                  >
                                    {tokens.map((token) => {
                                      return (
                                        <Select.Option key={token.assetId} value={token.assetId}>
                                          <div className={`${style.assetTo} ${style.assetToToken}`}>
                                            <span className={style.assetIcon}>
                                              <AssetImage fingerprint={token.fingerprint} />
                                            </span>
                                            <span className={style.assetName}>
                                              <span>{token.ticker}</span>
                                              <span>
                                                {token.quantity.toString()} —{' '}
                                                {token.fingerprint.slice(0, 9)}...
                                                {token.fingerprint.slice(-4)}
                                              </span>
                                            </span>
                                          </div>
                                        </Select.Option>
                                      )
                                    })}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  className={style.assetAmount}
                                  name={[tokenField.name, 'quantity']}
                                  fieldKey={[tokenField.fieldKey, 'quantity']}
                                  rules={[{ required: true, message: 'Required' }]}
                                >
                                  <InputNumber
                                    min="1"
                                    step="1"
                                    precision={0}
                                    size="large"
                                    placeholder="0"
                                    autoComplete="off"
                                    onChange={debounce(handleOnChange, 500)}
                                    // allowClear
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                                <Form.Item className={style.assetRemove}>
                                  <Button
                                    size="large"
                                    onClick={() => {
                                      tokenRemove(tokenField.name)
                                      handleRemove()
                                    }}
                                  >
                                    <i className="fe fe-trash-2" />
                                  </Button>
                                </Form.Item>
                              </Input.Group>
                            )
                          })}
                          <div className="mb-4">
                            <Button onClick={() => tokenAdd()} className="mr-3">
                              <i className="fe fe-plus-circle mr-1" />
                              Add Asset
                            </Button>
                            {index + 1 === fields.length && (
                              <Button onClick={() => add()}>
                                <i className="fe fe-plus-circle mr-1" />
                                Add Address
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </Form.List>
                    {index + 1 < fields.length && <div className={style.outputLine} />}
                  </div>
                )
              })}
            </>
          )}
        </Form.List>

        {hasError && <Alert className="mb-4" type="error" message={hasError} />}
        <div className="ray__item ray__item--success">
          <div className="row">
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Total</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={transactionData?.data?.spending?.value || '0'} />
                  {transactionData?.data?.spending?.tokens?.length > 0 &&
                    transactionData?.data?.spending.tokens.map((token, tokenIndex) => {
                      const { fingerprint, ticker } = tokens.filter(
                        (item) => item.assetId === token.asset.assetId,
                      )[0]

                      return (
                        <AmountFormatterAsset
                          amount={token.quantity || '0'}
                          key={tokenIndex}
                          ticker={ticker}
                          fingerprint={fingerprint}
                          availablePrivate
                        />
                      )
                    })}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Fee (inlc. in total)</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={transactionData?.data?.fee || '0'} small />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form.Item className="mt-4">
          <Button
            // onClick={onFinish}
            htmlType="submit"
            size="large"
            type="primary"
            className="ray__btn__send w-100"
            loading={walletLoading || transactionLoading}
            disabled={!walletParams.accountId || hasError}
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
