import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Tabs, Checkbox, Alert } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { CardanoGenerateMnemonic, CardanoValidateMnemonic } from 'utils/ray-cardano-crypto'
import style from './style.module.scss'

const MnemonicForm = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [currentTab, setCurrentTab] = useState('1')
  const [wroteDownMnemonic, setWroteDownMnemonic] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [generatedMnemonic, setGeneratedMnemonic] = useState('')
  const isModalVisible = useSelector((state) => state.settings.modalAddWallet)
  const hiddenMnemonic =
    '**** **** ******* ***** ****** ***** ***** ****** **** ***** **** ****** ***** ******* **** **** **** ******* ****** ******** ****** **** ***** *******'

  useEffect(() => {
    form.resetFields()
    generateNewMnemonic()
    setWroteDownMnemonic(false)
    setAgreeTerms(false)
  }, [isModalVisible, form])

  const unlockWallet = (mnemonic) => {
    dispatch({
      type: 'wallets/ADD_WALLET',
      payload: {
        mnemonic,
      },
    })
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalAddWallet',
        value: false,
      },
    })
  }

  const onFinish = (values) => {
    const { mnemonic } = values
    unlockWallet(mnemonic)
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
    setGeneratedMnemonic(mnemonicPhrase)
  }

  return (
    <div>
      <Tabs defaultActiveKey="1" className="ray__tabs" onChange={handleTabs}>
        <Tabs.TabPane
          tab={
            <span>
              <i className="fe fe-unlock mr-2" />
              Unlock
            </span>
          }
          key="1"
        />
        <Tabs.TabPane
          tab={
            <span>
              <i className="fe fe-plus-circle mr-2" />
              Create New
            </span>
          }
          key="2"
        />
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
              rules={[
                {
                  required: true,
                },
                () => ({
                  validator(_, value) {
                    if (!value || CardanoValidateMnemonic(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Mnemonic Phrase is wrong'))
                  },
                }),
              ]}
              className="py-2"
              hasFeedback
            >
              <Input.TextArea size="large" autoSize placeholder="Enter your wallet mnemonic" />
            </Form.Item>
            <div className="mb-3">
              <Checkbox checked={agreeTerms} onChange={handleAgreeTrems}>
                By using Ray Wallet, or other Ray Network software, I agree to the{' '}
                <a className="ray__link">Terms of Use & Privacy Policy</a>
              </Checkbox>
            </div>
            <Form.Item className="mb-0">
              <Button
                disabled={!agreeTerms}
                htmlType="submit"
                size="large"
                type="primary"
                className="ray__btn__send"
              >
                <i className="fe fe-unlock" />
                <strong>Unlock Wallet</strong>
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
      {currentTab === '2' && (
        <div>
          <p>New wallet is created with a mnemonic phrase listed below</p>
          <div className="py-2">
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
              {isModalVisible ? generatedMnemonic : hiddenMnemonic}
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1">
              <Checkbox checked={agreeTerms} onChange={handleAgreeTrems}>
                By using Ray Wallet, or other Ray Network software, I agree to the{' '}
                <a className="ray__link">Terms of Use & Privacy Policy</a>
              </Checkbox>
            </div>
            <div className="mb-3">
              <Checkbox checked={wroteDownMnemonic} onChange={handleWroteDownMnemonic}>
                I wrote down my wallet mnemonic
              </Checkbox>
            </div>
            {wroteDownMnemonic && (
              <div className="mb-4">
                <Alert
                  showIcon
                  type="warning"
                  message="Proceed with caution!"
                  description={
                    <div>
                      <p>
                        Your information is not stored on our servers and the Ray Network developers
                        have no access to your mnemonic. If you lose this data, you lose access to
                        your wallet
                      </p>
                      <p className="mb-0">
                        Please double check that the mnemonic is written correctly and stored
                        securely
                      </p>
                    </div>
                  }
                />
              </div>
            )}
            <Button
              disabled={!(wroteDownMnemonic && agreeTerms)}
              htmlType="submit"
              size="large"
              type="primary"
              className="ray__btn__send"
              onClick={() => unlockWallet(generatedMnemonic)}
            >
              <i className="fe fe-unlock" />
              <strong>Unlock Wallet</strong>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MnemonicForm
