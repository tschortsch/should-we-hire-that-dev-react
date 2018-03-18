import React from 'react'
import CountUp from 'react-countup';

const OverallRanking = ({ title, value, maxRanking = 0 }) => {
  let ranking = 0
  let rankingPercent = 0
  if ( value && maxRanking ) {
    rankingPercent = value * 100 / maxRanking
    ranking = Math.round(rankingPercent / 10) * 10;
  }

  return (
    <div className={`col-md-8 col-10 ${ ranking > 0 ? 'rank-' + ranking : ''  }`}>
      <h3>{title}</h3>
      <p className="value"><CountUp start={0} end={value}/> / {maxRanking}</p>
      <div className="progress">
        <div className="progress-bar" role="progressbar" style={{ width: rankingPercent + '%' }} aria-valuenow={rankingPercent}
             aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  )
}

export default OverallRanking
