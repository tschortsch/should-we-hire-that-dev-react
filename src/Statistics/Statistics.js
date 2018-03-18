import React from 'react'
import moment from 'moment'
import StatisticsBox from './StatisticsBox'
import './Statistics.scss'

class Statistics extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
    console.log(this.state)
  }

  getInitialState = () => {
    return {
      maxRanking: 0,
      overallRanking: 0,
      statisticsValues: {
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
    }
  }

  judgementLimits = {
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

  /*getRanking = (type, value, rawValue) => {
    if(typeof rawValue === 'undefined') {
      rawValue = value;
    }

    const judgement = this.getJudgement(type, rawValue);
    maxRanking += 100;
    overallRanking += judgement;
    return judgement
  }*/

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
      this.setState({
        statisticsValues: {
          createdAt: {
            value: createdAtMoment.fromNow(),
            additionalValue: createdAtMoment.format('(DD.MM.YYYY)'),
            ranking: this.getJudgement('createdAt', currentTimestamp - createdAtTimestamp)
          },
          stars: {
            value: starsCount,
            ranking: this.getJudgement('stars', starsCount)
          },
          followers: {
            value: followersValue,
            ranking: this.getJudgement('followers', followersValue)
          },
          commits: {
            value: commitsValue,
            ranking: this.getJudgement('commits', commitsValue)
          },
          repos: {
            value: reposValue,
            ranking: this.getJudgement('repos', reposValue)
          }
        }
      })
    } else {
      this.setState(this.getInitialState())
    }
  }

  render() {
    return (
      <div className="row statistics justify-content-center">
        <StatisticsBox title="User since" value={this.state.statisticsValues.createdAt.value}
                       additionalValue={this.state.statisticsValues.createdAt.additionalValue}
                       ranking={this.state.statisticsValues.createdAt.ranking}/>
        <StatisticsBox title="Followers" value={this.state.statisticsValues.followers.value}
                       ranking={this.state.statisticsValues.followers.ranking}/>
        <StatisticsBox title="Total commits" value={this.state.statisticsValues.commits.value}
                       ranking={this.state.statisticsValues.commits.ranking}/>
        <StatisticsBox title="Public repos" value={this.state.statisticsValues.repos.value}
                       ranking={this.state.statisticsValues.repos.ranking}/>
        <StatisticsBox title="Stars" value={this.state.statisticsValues.stars.value}
                       ranking={this.state.statisticsValues.stars.ranking}/>
      </div>
    )
  }
}

export default Statistics
