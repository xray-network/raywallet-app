import { message, Upload } from 'antd'
import { useDispatch } from 'react-redux'
import { binaryToString } from 'utils/utils'
import React from 'react'

const KeyFile = () => {
  const dispatch = useDispatch()

  const importWallet = (data) => {
    dispatch({
      type: 'wallets/IMPORT_WALLET',
      payload: {
        data,
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

  const props = {
    name: 'file',
    showUploadList: false,
    beforeUpload(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(binaryToString(e.target.result))
          if (data.publicKey) {
            importWallet(data)
          } else {
            message.error('Wrong .key file')
          }
        } catch {
          message.error('Wrong .key file')
        }
      }
      reader.readAsText(file)
      return false
    },
  }

  return (
    <div>
      <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon pt-3">
          <i className="fe fe-file-plus font-size-32" />
        </p>
        <p className="ant-upload-text">Click or drag .key file to this area to upload</p>
        <p className="ant-upload-hint">Your wallet will be added instantly</p>
      </Upload.Dragger>
    </div>
  )
}

export default KeyFile
