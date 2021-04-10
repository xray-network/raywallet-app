import React from 'react'
import { Input, Form, Select, Button } from 'antd'
import { useSelector } from 'react-redux'
import AmountFormatterAda from 'components/Layout/AmountFormatterAda'
import AssetImage from 'components/Layout/AssetImage'
import style from './style.module.scss'

const swapAssets = [
  {
    ticker: 'ADA',
    fingerprint: 'ada',
  },
  {
    ticker: 'RAY',
    fingerprint: 'asset1zyyjv27uxh3kcz0cvmyrfrc7lpht2hcjwr9lul',
  },
  {
    ticker: 'TEST',
    fingerprint: 'asset1cvmyrfrc7lpht2hcjwr9lulzyyjv27uxh3kcz0',
  },
]

const Swap = () => {
  const [form] = Form.useForm()
  const walletAssetsSummary = useSelector((state) => state.wallets.walletAssetsSummary)

  return (
    <div>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Input.Group compact className={style.assetGroup}>
          <Form.Item
            className={style.assetTicker}
            label="From"
            name="fromTicker"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Select size="large" placeholder="Select">
              <Select.Option value="ada">
                <div className={style.assetTo}>
                  <span className={style.assetIcon}>
                    <AssetImage fingerprint="ada" />
                  </span>
                  <span className={style.assetTo}>ADA</span>
                </div>
              </Select.Option>
              {walletAssetsSummary.tokens.map((token) => {
                return (
                  <Select.Option key={token.fingerprint} value={token.fingerprint}>
                    <div className={style.assetTo}>
                      <span className={style.assetIcon}>
                        <AssetImage fingerprint={token.fingerprint} />
                      </span>
                      <span className={style.assetTo}>{token.ticker}</span>
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
        </Input.Group>
        <Form.Item
          label="To"
          name="toTicker"
          rules={[{ required: true, message: 'Please slect ticker' }]}
        >
          <Select size="large" placeholder="Select">
            {swapAssets &&
              swapAssets.map((item) => {
                return (
                  <Select.Option key={item.fingerprint} value={item.fingerprint}>
                    <div className={style.assetTo}>
                      <span className={style.assetIcon}>
                        <AssetImage fingerprint={item.fingerprint} />
                      </span>
                      <span className="mr-2">{item.ticker}</span>
                      <span className="badge badge-light">
                        {item.fingerprint.slice(0, 9)}...{item.fingerprint.slice(-4)}
                      </span>
                    </div>
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>
        <div className="ray__item ray__item--gray">
          <div className="row">
            <div className="col-lg-6">
              <div className="ray__form__item mb-3">
                <div className="ray__form__label">You will send</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={0} />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">Fee (inlc. in total)</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={0} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label">You will receive</div>
                <div className="ray__form__amount">
                  <AmountFormatterAda amount={0} />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ray__form__item">
                <div className="ray__form__label mb-3">Rate</div>
                <div className="ray__form__amount">
                  <strong>0 ADA = 0 RAY</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form.Item className="mt-4">
          <Button
            htmlType="submit"
            disabled
            size="large"
            type="primary"
            className="ray__btn__send w-100"
          >
            <i className="fe fe-repeat" />
            <strong>Swap</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Swap
