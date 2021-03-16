import React, { useState } from 'react'
import { Form, Input, Button, Tabs, Checkbox, Alert } from 'antd'
import { CardanoGenerateMnemonic, CardanoValidateMnemonic } from 'utils/cardano-js-api'
import style from './style.module.scss'

const MnemonicForm = () => {

  const [form] = Form.useForm()
  const [currentTab, setCurrentTab] = useState('1')
  const [wroteDownMnemonic, setWroteDownMnemonic] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [mnemonic, setMnemonic] = useState(CardanoGenerateMnemonic())

  const onFinish = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleTabs = (value) => {
    setCurrentTab(value)
  }

  const handleWroteDownMnemonic = (e) => {
    setWroteDownMnemonic(e.target.checked)
  }

  const handleAgreeTrems = (e) => {
    setAgreeTerms(e.target.checked)
  }

  const generateNewMnemonic = () => {
    const mnemonicPhrase = CardanoGenerateMnemonic()
    console.log('valid:', CardanoValidateMnemonic(mnemonicPhrase))
    setMnemonic(mnemonicPhrase)
  }

  return (
    <div>
      <Tabs defaultActiveKey="1" className="ray__tabs" onChange={handleTabs}>
        <Tabs.TabPane tab="Unlock Wallet" key="1" />
        <Tabs.TabPane tab="Create New Wallet" key="2" />
      </Tabs>
      {currentTab === '1' && (
        <div>
          <p>Enter the 24-word wallet mnemonic seed phrase</p>
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Mnemonic Phrase"
              name="mnemonic"
              rules={[{ required: true }]}
            >
              <Input size="large" placeholder="Enter your wallet mnemonic" />
            </Form.Item>
            <div className="mb-3">
              <Checkbox checked={agreeTerms} onChange={handleAgreeTrems}>
                By using Ray Wallet, or other Ray Network software, I agree to the{' '}
                <a href="https://rraayy.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                {' '}and{' '}
                <a href="https://rraayy.com/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a>
              </Checkbox>
            </div>
            <Form.Item className="mb-0">
              <Button disabled={!agreeTerms} htmlType="submit" size="large" type="primary" className="ray__btn__send">
                <i className="fe fe-plus-circle" />
                <strong>Unlock</strong>
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
      {currentTab === '2' && (
        <div>
          <p>New wallet is created with a mnemonic phrase listed below</p>
          <div className="ray__form__label">
            <span className="mr-2">Mnemonic Phrase</span>
            <a
              onClick={generateNewMnemonic}
              onKeyPress={generateNewMnemonic}
              role="button"
              tabIndex="-1"
              className="ray__link"
            >
              Generate New
            </a>
          </div>
          <div className={style.mnemonicArea}>
            {mnemonic}
          </div>
          <div className="mt-4">
            <div className="mb-1">
              <Checkbox checked={agreeTerms} onChange={handleAgreeTrems}>
                By using Ray Wallet, or other Ray Network software, I agree to the{' '}
                <a href="https://rraayy.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                {' '}and{' '}
                <a href="https://rraayy.com/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a>
              </Checkbox>
            </div>
            <div className="mb-3">
              <Checkbox checked={wroteDownMnemonic} onChange={handleWroteDownMnemonic}>I wrote down my wallet mnemonic</Checkbox>
            </div>
            {wroteDownMnemonic && (
              <div className="mb-4">
                <Alert
                  showIcon
                  type="warning"
                  message="Proceed with caution!"
                  description={(
                    <div>
                      <p>This information is not stored on our servers and the Ray Network developers have no access to your mnemonics. If you lose this data, you lose access to your wallet.</p>
                      <p className="mb-0">Please double check that the mnemonic is written correctly and stored securely.</p>
                    </div>
                  )}
                />
              </div>
            )}
            <Button disabled={!(wroteDownMnemonic && agreeTerms)} htmlType="submit" size="large" type="primary" className="ray__btn__send">
              <i className="fe fe-plus-circle" />
              <strong>Access Wallet</strong>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MnemonicForm
