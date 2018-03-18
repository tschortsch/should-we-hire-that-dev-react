import React from 'react'
import CountUp from 'react-countup';

const StatisticsBox = ({ title, value, additionalValue = '', ranking }) => (
  <div className={`col-md-6 mb-5 ${ ranking > 0 ? 'rank-' + ranking : ''  }`}>
    <h3>{title}</h3>
    <p className="value">
      { Number.isInteger(value) ?
        <CountUp start={0} end={value}/>
        : value
      }
    </p>
    {additionalValue !== '' ?
      <p>{additionalValue}</p>
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
