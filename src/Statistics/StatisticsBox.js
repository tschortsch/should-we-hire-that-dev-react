import React from 'react'

const StatisticsBox = ({ title, value, additionalValue = '', ranking }) => (
  <div className={`col-md-6 ${ ranking > 0 ? 'rank-' + ranking : ''  }`} id="user-since">
    <h3>{title}</h3>
    <p className="value">{value}</p>
    {additionalValue !== '' ?
      <p className="value">{additionalValue}</p>
      : null
    }
    <div className="row justify-content-center">
      <div className="col-6">
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: ranking + '%' }} aria-valuenow={ ranking } aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  </div>
)

export default StatisticsBox
