import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'antd'

const TermsModal = () => {
  const dispatch = useDispatch()
  const modalTerms = useSelector((state) => state.settings.modalTerms)

  const handleCancel = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'modalTerms',
        value: false,
      },
    })
  }

  return (
    <Modal
      style={{ top: 20 }}
      title="Terms of Use / Privacy Policy"
      footer={null}
      visible={modalTerms}
      onCancel={handleCancel}
      width={820}
    >
      <div>
        <h5 className="mb-4">Terms of Service Agreement</h5>
        <p>
          THIS TERMS OF SERVICE AGREEMENT (&quot;Agreement&quot;) is made between EMURGO Co., Ltd.
          (&quot;Company&quot;) and any person or entity (&quot;User&quot;) who completes the
          process to download, utilize, or operate the software known as the Yoroi cryptocurrency
          Wallet application, and data processing service, application, communication service or
          other content or offered or provided with the software by the Company
          (&quot;Software&quot;). The Company and User are collectively referred to as the
          &quot;Parties.&quot; BY CLICKING THE ACCEPTANCE BUTTON OR ACCESSING, USING OR INSTALLING
          ANY PART OF THE SOFTWARE, USER EXPRESSLY AGREES TO AND CONSENTS TO BE LEGALLY BOUND BY ALL
          OF THE TERMS OF THIS AGREEMENT. IF USER DOES NOT AGREE TO ALL OF THE TERMS OF THIS
          AGREEMENT, THE USER SHALL NOT BE AUTHORIZED TO ACCESS, USE OR INSTALL ANY PART OF THE
          SOFTWARE.
        </p>
        <div className="mb-5" />
        <h5 className="mb-4">1. Rights and Obligations</h5>
        <ol type="a">
          <li>
            <strong>Description.</strong> The Software functions as a free, open source, digital
            cryptocurrency wallet. The Software does not constitute an account by which the Company
            or any other third parties serve as financial intermediaries or custodians of
            User&apos;s ADA or any other cryptocurrency. While the Software has undergone beta
            testing and continues to be improved by feedback from the developers community,
            open-source contributors and beta-testers, the Company cannot guarantee that there will
            be no bugs in the Software. User acknowledges that User&apos;s use of the Software is at
            User&apos;s risk, discretion and in compliance with all applicable laws. User is
            responsible for safekeeping User&apos;s passwords, PINs, private keys, redemption keys,
            shielded vending keys, backup recovery mnemonic passphrases, ADA passcodes and any other
            codes User uses to access the Software or any information, ADA, voucher, or other
            cryptocurrency unit. IF USER LOSES ACCESS TO USER&apos;S CRYPTOCURRENCY WALLET OR
            PRIVATE KEYS AND HAS NOT SEPARATELY STORED A BACKUP OF USER&apos;S CRYPTOCURRENCY WALLET
            OR BACKUP RECOVERY MNEMONIC PHRASE(S) AND CORRESPONDING PASSWORD(S), USER ACKNOWLEDGES
            AND AGREES THAT ANY ADA OR ANY OTHER CRYPTOCURRENCIES USER HAS ASSOCIATED WITH THAT
            CRYPTOCURRENCY WALLET WILL BECOME INACCESSIBLE. All transaction requests are
            irreversible. The Company and its shareholders, directors, officers, employees,
            affiliates and agents cannot guarantee transaction confirmation or retrieve User&apos;s
            private keys or passwords if User loses or forgets them.
          </li>
        </ol>
      </div>
    </Modal>
  )
}

export default TermsModal
