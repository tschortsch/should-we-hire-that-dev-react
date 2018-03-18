import React from 'react'
import moment from 'moment'
import StatisticsBox from './StatisticsBox'
import './Statistics.scss'

const Statistics = ({userdata, isLoading, commitsTotalCount}) => {
  const judgementLimits = {
    'commits': new Map([
      [100, 10000],
      [90, 8000],
      [80, 6000],
      [70, 4000],
      [60, 2000],
      [50, 1000],
      [40, 700],
      [30, 500],
      [20, 300],
      [10, 100]
    ]),
    'followers': new Map([
      [100, 1000],
      [90, 600],
      [80, 300],
      [70, 150],
      [60, 90],
      [50, 50],
      [40, 30],
      [30, 20],
      [20, 10],
      [10, 5]
    ]),
    'repos': new Map([
      [100, 100],
      [90, 80],
      [80, 60],
      [70, 45],
      [60, 35],
      [50, 25],
      [40, 20],
      [30, 15],
      [20, 10],
      [10, 5]
    ]),
    'stars': new Map([
      [100, 250],
      [90, 200],
      [80, 150],
      [70, 100],
      [60, 70],
      [50, 50],
      [40, 30],
      [30, 20],
      [20, 10],
      [10, 5]
    ]),
    'createdAt': new Map([
      [100, 6 * (365 * 24 * 60 * 60)], // 6 years
      [90, 5 * (365 * 24 * 60 * 60)],
      [80, 4.5 * (365 * 24 * 60 * 60)],
      [70, 4 * (365 * 24 * 60 * 60)],
      [60, 3.5 * (365 * 24 * 60 * 60)],
      [50, 3 * (365 * 24 * 60 * 60)],
      [40, 2.5 * (365 * 24 * 60 * 60)],
      [30, 2 * (365 * 24 * 60 * 60)],
      [20, 1.5 * (365 * 24 * 60 * 60)],
      [10, (365 * 24 * 60 * 60)]
    ])
  };


  const getRanking = (type, value, rawValue) => {
    if(typeof rawValue === 'undefined') {
      rawValue = value;
    }

    const judgement = getJudgement(type, rawValue);
    maxRanking += 100;
    overallRanking += judgement;
    return judgement
  }

  const getJudgement = (type, value) => {
    if(judgementLimits.hasOwnProperty(type)) {
      for(let [rank, limit] of judgementLimits[type]) {
        if(value >= limit) {
          return rank;
        }
      }
    }
    return 0;
  }

  let maxRanking = 0;
  let overallRanking = 0;
  let statisticsValues = {
    createdAt: {
      value: '-',
      additionalValue: '',
      ranking: 0
    },
    stars: {
      value: 0,
      ranking: 0
    },
    followers: {
      value: 0,
      ranking: 0
    },
    commits: {
      value: 0,
      ranking: 0
    },
    repos: {
      value: 0,
      ranking: 0
    }
  }

  if ( userdata && commitsTotalCount ) {
    const createdAt = new Date(userdata.createdAt);
    const createdAtMoment = moment(createdAt);
    const createdAtTimestamp = createdAtMoment.unix();
    const currentTimestamp = moment().unix();
    statisticsValues.createdAt.value = createdAtMoment.fromNow()
    statisticsValues.createdAt.additionalValue = createdAtMoment.format('(DD.MM.YYYY)')
    statisticsValues.createdAt.ranking = getJudgement('createdAt', currentTimestamp - createdAtTimestamp)
    statisticsValues.stars.value = userdata.repositories.nodes.reduce((starsCount, repo) => {
      return starsCount + repo.stargazers.totalCount;
    }, 0);
    statisticsValues.stars.ranking = getJudgement('stars', statisticsValues.stars.value)
    statisticsValues.followers.value = userdata.followers.totalCount
    statisticsValues.followers.ranking = getJudgement('followers', statisticsValues.followers.value)
    statisticsValues.commits.value = commitsTotalCount
    statisticsValues.commits.ranking = getJudgement('commits', statisticsValues.commits.value)
    statisticsValues.repos.value = userdata.repositories.totalCount
    statisticsValues.repos.ranking = getJudgement('repos', statisticsValues.repos.value)

  }

  return (
    <div className="row statistics justify-content-center">
      <StatisticsBox title="User since" value={statisticsValues.createdAt.value} additionalValue={statisticsValues.createdAt.additionalValue} ranking={statisticsValues.createdAt.ranking}/>
      <StatisticsBox title="Followers" value={statisticsValues.followers.value} ranking={statisticsValues.followers.ranking}/>
      <StatisticsBox title="Total commits" value={statisticsValues.commits.value} ranking={statisticsValues.commits.ranking}/>
      <StatisticsBox title="Public repos" value={statisticsValues.repos.value} ranking={statisticsValues.repos.value}/>
      <StatisticsBox title="Stars" value={statisticsValues.stars.value} ranking={statisticsValues.stars.ranking}/>
    </div>
  )
}

export default Statistics
