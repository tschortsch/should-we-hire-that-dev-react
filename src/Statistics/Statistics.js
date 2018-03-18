import React from 'react'
import moment from 'moment'
import StatisticsBox from './StatisticsBox'
import OverallRanking from './OverallRanking'
import './Statistics.scss'

class Statistics extends React.Component {
  constructor() {
    super()
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      statisticsValues: [
        {
          name: 'createdAt',
          value: '-',
          additionalValue: '',
          ranking: 0
        },
        {
          name: 'stars',
          value: 0,
          ranking: 0
        },
        {
          name: 'followers',
          value: 0,
          ranking: 0
        },
        {
          name: 'commits',
          value: 0,
          ranking: 0
        },
        {
          name: 'repos',
          value: 0,
          ranking: 0
        }
      ],
      overallRanking: {
        value: '-',
        ranking: 0
      }
    }
  }

  getStatisticsTitles = (name) => {
    const statisticsTitles = {
      createdAt: 'User since',
      stars: 'Stars',
      followers: 'Followers',
      commits: 'Total commits',
      repos: 'Public repos'
    }
    return statisticsTitles[name]
  }

  judgementLimits = {
    commits: new Map([
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
    followers: new Map([
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
    repos: new Map([
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
    stars: new Map([
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
    createdAt: new Map([
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

  getOverallRankingValue = () => {
    return this.state.statisticsValues.reduce((rankingAccumulator, statisticsValue) => {
      return rankingAccumulator + statisticsValue.ranking
    }, 0)
  }
  getMaxRanking = () => {
    return 100 * this.state.statisticsValues.length
  }

  getJudgement = (type, value) => {
    if(this.judgementLimits.hasOwnProperty(type)) {
      for(let [rank, limit] of this.judgementLimits[type]) {
        if(value >= limit) {
          return rank;
        }
      }
    }
    return 0;
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.userdata && nextProps.commitsTotalCount ) {
      const createdAt = new Date(nextProps.userdata.createdAt);
      const createdAtMoment = moment(createdAt);
      const createdAtTimestamp = createdAtMoment.unix();
      const currentTimestamp = moment().unix();
      const starsCount = nextProps.userdata.repositories.nodes.reduce((starsCount, repo) => {
        return starsCount + repo.stargazers.totalCount;
      }, 0)
      const followersValue = nextProps.userdata.followers.totalCount
      const commitsValue = nextProps.commitsTotalCount
      const reposValue = nextProps.userdata.repositories.totalCount

      const overallRankingValue = Math.round(this.getOverallRankingValue() * 100 / this.getMaxRanking() / 10) * 10;

      this.setState({
        statisticsValues: [
          {
            name: 'createdAt',
            value: createdAtMoment.fromNow(),
            additionalValue: createdAtMoment.format('(DD.MM.YYYY)'),
            ranking: this.getJudgement('createdAt', currentTimestamp - createdAtTimestamp)
          },
          {
            name: 'stars',
            value: starsCount,
            ranking: this.getJudgement('stars', starsCount)
          },
          {
            name: 'followers',
            value: followersValue,
            ranking: this.getJudgement('followers', followersValue)
          },
          {
            name: 'commits',
            value: commitsValue,
            ranking: this.getJudgement('commits', commitsValue)
          },
          {
            name: 'repos',
            value: reposValue,
            ranking: this.getJudgement('repos', reposValue)
          }
        ],
        overallRanking: {
          value: this.getOverallRankingValue() + '/' + this.getMaxRanking(),
          ranking: overallRankingValue
        }
      })
    } else {
      this.setState(this.getInitialState())
    }
  }

  render() {
    return (
      <div className="row statistics justify-content-center">
        { this.state.statisticsValues.map( (statisticsValue, index) => (
          <StatisticsBox title={this.getStatisticsTitles(statisticsValue.name)} value={statisticsValue.value}
                         additionalValue={statisticsValue.additionalValue}
                         ranking={statisticsValue.ranking}
                         key={index} />
        ) ) }
        <OverallRanking title="Overall ranking" value={this.state.overallRanking.value}
                        ranking={this.state.overallRanking.ranking}/>
      </div>
    )
  }
}

export default Statistics
