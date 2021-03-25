import React from 'react'
import { Tooltip, message } from 'antd'
import { useDispatch } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const AddressQR = ({ address, index }) => {
  const dispatch = useDispatch()

  const onCopy = () => {
    message.success('Copied to clipboard')
  }

  const showQr = (qrAddress) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'QRCodeAddress',
        value: qrAddress,
      },
    })
  }

  return (
    <div key={index} className="d-flex mb-3">
      {index >= -1 && (
        <div className="ray__address__path mr-2">
          <sup>/</sup>
          {index}
        </div>
      )}
      <Tooltip title="Show QR Code">
        <a
          className="ray__address__qr mr-2"
          onClick={() => showQr(address)}
          onKeyPress={() => showQr(address)}
          role="button"
          tabIndex="-1"
        >
          <i className="fe fe-grid" />
        </a>
      </Tooltip>
      <CopyToClipboard text={address} onCopy={onCopy}>
        <Tooltip title="Copy to Clipboard">
          <a className="ray__address pl-1">{address}</a>
        </Tooltip>
      </CopyToClipboard>
    </div>
  )
}

export default AddressQR
