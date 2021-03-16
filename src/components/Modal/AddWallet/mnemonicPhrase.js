import React, { useState } from 'react'
import { Form, Input, Button, Tabs, Checkbox, Alert } from 'antd'
import { CardanoGenerateMnemonic, CardanoValidateMnemonic } from 'utils/cardano-js-api'
import style from './style.module.scss'

const MnemonicForm = () => {

  const [form] = Form.useForm()
  const [currentTab, setCurrentTab] = useState('1')
  const [wroteDown, setWroteDown] = useState(false)
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

  const handleWroteDown = (e) => {
    setWroteDown(e.target.checked)
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
              className="pb-2"
              label="Mnemonic Phrase"
              name="mnemonic"
              rules={[{ required: true }]}
            >
              <Input size="large" placeholder="Enter your wallet mnemonic" />
            </Form.Item>
            <Form.Item className="mb-0">
              <Button disabled htmlType="submit" size="large" type="primary" className="ray__btn__send">
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
            <div className="mb-3">
              <Checkbox checked={wroteDown} onChange={handleWroteDown}>I wrote down my wallet mnemonic</Checkbox>
            </div>
            {wroteDown && (
              <div className="mb-4">
                <Alert
                  showIcon
                  type="warning"
                  message="Proceed with caution!"
                  description="Please double check that the mnemonic is written correctly and stored securely"
                />
              </div>
            )}
            <Button disabled={!wroteDown} htmlType="submit" size="large" type="primary" className="ray__btn__send">
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
