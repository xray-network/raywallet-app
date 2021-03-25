import React from 'react'
import { Modal, Tooltip, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSelector, useDispatch } from 'react-redux'
import QRCode from 'qrcode.react'
import style from './style.module.scss'

const QRModal = () => {
  const dispatch = useDispatch()
  const QRCodeAddress = useSelector((state) => state.settings.QRCodeAddress)
  const address = QRCodeAddress || 'addr1xxx'

  const onCopy = () => {
    message.success('Copied to clipboard')
  }

  const handleCancel = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'QRCodeAddress',
        value: '',
      },
    })
  }

  return (
    <Modal title={null} footer={null} visible={QRCodeAddress} onCancel={handleCancel} width={440}>
      <div>
        <div className={style.logo}>
          <img src="/logo.svg" alt="" />
          <span className={style.logoName}>WALLET</span>
        </div>
      </div>
      <div className="text-center">
        <div className={style.qr}>
          <QRCode value={address} size="256" />
        </div>
        <div className="ray__address mb-2">{address}</div>
        <CopyToClipboard text={address} onCopy={onCopy}>
          <Tooltip title="Copy to Clipboard">
            <a className="ray__address pl-1">Copy Address</a>
          </Tooltip>
        </CopyToClipboard>
      </div>
    </Modal>
  )
}

export default QRModal
