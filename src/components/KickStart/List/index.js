import React from 'react'
import { Input, Radio, Button, Tooltip } from 'antd'
// import style from './style.module.scss'

const projects = [
  {
    id: '0x717824329859127359871235189',
    name: 'RAY Network',
    url: 'https://rraayy.com',
    rate: '100',
    type: 'not-end',
    end: '',
    descriptionShort:
      'RAY Network is a Cardano services ecosystem with an assets exchange with a decentralized protocol for automated liquidity provision.',
  },
]

const KickStartList = () => {
  return (
    <div>
      <div className="mb-3">
        <Input size="large" placeholder="Search project by name..." />
      </div>
      <div className="mb-4">
        <Radio.Group defaultValue="all">
          <Radio value="all">All</Radio>
          <Radio value="premium">Premium</Radio>
          <Radio value="active">Active</Radio>
          <Radio value="Completed">Completed</Radio>
        </Radio.Group>
      </div>
      {projects.map((project, index) => {
        return (
          <div key={index} className="ray__item ray__item--primary">
            <div className="mb-1 d-flex">
              <div>
                <strong className="mr-2">{project.name}</strong>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <i className="fe fe-external-link" />
                </a>
              </div>
              <div className="ml-auto">
                <span className="badge badge-primary font-size-12 ml-2">premium</span>
                <span className="badge badge-success font-size-12 ml-2">active</span>
              </div>
            </div>
            <div className="ray__item__id mb-2">{project.id}</div>
            <div className="row">
              <div className="col-lg-4">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Tokens left</div>
                  <div className="ray__form__amount">
                    <span className="badge badge-light">1000000 RAY</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Rate</div>
                  <div className="ray__form__amount">
                    <span className="badge badge-light">1 ADA = 1 RAY</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="ray__form__item mb-3">
                  <div className="ray__form__label">Until</div>
                  <span className="badge badge-light">lifetime</span>
                </div>
              </div>
            </div>
            <div className="font-size-14 mb-3">{project.descriptionShort}</div>
            <div>
              <Tooltip title="Soon">
                <Button disabled>
                  <i className="fe fe-shopping-bag mr-1" />
                  Swap Tokens
                </Button>
              </Tooltip>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KickStartList
