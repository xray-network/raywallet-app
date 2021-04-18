import React, { useEffect } from 'react'
import { Modal, Form, Input, Button, Alert } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
// import style from './style.module.scss'

const EncryptModal = () => {
  const dispatch = useDispatch()
  const modalEncrypt = useSelector((state) => state.settings.modalEncrypt)
  const walletParams = useSelector((state) => state.wallets.walletParams)
  const [encryptForm] = Form.useForm()
  const [decryptForm] = Form.useForm()

  useEffect(() => {
    encryptForm.resetFields()
    decryptForm.resetFields()
  }, [modalEncrypt, encryptForm, decryptForm])

  const handleCancel = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalEncrypt',
        value: false,
      },
    })
  }

  const onEncrypt = (values) => {
    dispatch({
      type: 'wallets/ENCRYPT_WALLET',
      payload: {
        password: values.password,
      },
    })
    encryptForm.resetFields()
    decryptForm.resetFields()
  }

  const onDecrypt = (values) => {
    dispatch({
      type: 'wallets/DECRYPT_WALLET',
      payload: {
        password: values.password,
      },
    })
    encryptForm.resetFields()
    decryptForm.resetFields()
  }

  return (
    <Modal
      title={
        <div>
          <div>Wallet Encryption</div>
          {/* <div>
            <small className="text-muted">{walletParams.accountId}</small>
          </div> */}
        </div>
      }
      footer={null}
      visible={modalEncrypt}
      onCancel={handleCancel}
      width={620}
      forceRender
    >
      <div className={walletParams.encrypted ? 'd-none' : ''}>
        <Form form={encryptForm} name="encryptForm" layout="inline" onFinish={onEncrypt}>
          <Form.Item
            className="mb-2"
            name="password"
            rules={[
              {
                required: true,
                message: 'Required',
              },
              {
                min: 8,
                message: 'Minimum 8 symbols',
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            className="mb-2"
            name="confirm"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Required',
              },
              {
                min: 8,
                message: 'Minimum 8 symbols',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Not match!'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Repeat password" />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !encryptForm.isFieldsTouched(true) ||
                  !!encryptForm.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                <i className="fe fe-lock mr-2" />
                Save Wallet
              </Button>
            )}
          </Form.Item>
        </Form>
        <div className="mb-4">
          <small>The passwords needs to be at least 8 symbols.</small>
        </div>
        <Alert
          showIcon
          type="info"
          message="Important information"
          description={
            <div>
              <p>
                This password will be used to encrypt and store your private key on this device,
                this will be useful if you do not want to add your wallet every time
              </p>
              <p>You will need it to sign the transaction when you send your funds</p>
              <p className="mb-0">
                If you lost your password, you can still recover your wallet with the mnemonic
                phrase
              </p>
            </div>
          }
        />
      </div>
      <div className={!walletParams.encrypted ? 'd-none' : ''}>
        <div className="mb-4">
          <Alert showIcon type="success" message="Wallet is encrypted and saved on this device" />
        </div>
        <Form form={decryptForm} name="decryptForm" layout="inline" onFinish={onDecrypt}>
          <Form.Item
            className="mb-2"
            name="password"
            rules={[
              {
                required: true,
                message: 'Required',
              },
            ]}
          >
            <Input.Password placeholder="Wallet password" />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !decryptForm.isFieldsTouched(true) ||
                  !!decryptForm.getFieldsError().filter(({ errors }) => errors.length).length
                }
              >
                <i className="fe fe-unlock mr-2" />
                Disconnect Wallet
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default EncryptModal
