import React from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
// import { CardanoGenerateMnemonic, CardanoValidateMnemonic } from 'utils/cardano-js-api'

const StakeBalances = () => {
  // const mnemonic = CardanoGenerateMnemonic()
  // console.log(mnemonic)
  // console.log('valid:', CardanoValidateMnemonic(mnemonic))

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const isModalVisible = useSelector((state) => state.settings.modalAddWallet)

  const onFinish = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleCancel = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalAddWallet',
        value: false,
      },
    })
  }

  return (
    <Modal
      title="Add Wallet"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={760}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Wallet ID" name="id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item className="mt-4">
          <Button htmlType="submit" size="large" type="primary">
            <i className="fe fe-plus-circle" />
            <strong>Add</strong>
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default StakeBalances
