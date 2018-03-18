import React from 'react'

const OverallRanking = ({ title, value, ranking }) => (
  <div className={`col-md-8 col-10 ${ ranking > 0 ? 'rank-' + ranking : ''  }`}>
    <h3>{title}</h3>
    <p className="value">{value}</p>
    <div className="progress">
      <div className="progress-bar" role="progressbar" style={{ width: ranking + '%' }} aria-valuenow={ ranking } aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  </div>
)

export default OverallRanking
