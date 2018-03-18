import React from 'react'
import Chart from 'chart.js';

class LanguageStatistics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      languagesPieChartInstance: null
    }
  }
  componentWillReceiveProps(nextProps) {
    if ( nextProps.repositoriesContributedTo !== this.props.repositoriesContributedTo && nextProps.repositoriesContributedTo.length > 0 ) {
      console.log(nextProps.repositoriesContributedTo)
      let totalLanguages = 0;
      const languageStatistics = nextProps.repositoriesContributedTo.reduce((accumulator, repository) => {
        repository.languages.edges.forEach(language => {
          let count = accumulator.get(language.node.name);
          if (count) {
            count += language.size;
          } else {
            count = language.size;
          }
          accumulator.set(language.node.name, count);
          totalLanguages += language.size;
        });
        return accumulator;
      }, new Map());
      console.log(languageStatistics);

      const languageStatisticsPercentage = [...languageStatistics.entries()].reduce((accumulator, language) => {
        const languagePercentage = this.getPercentage(language[1], totalLanguages);
        if (languagePercentage < 2) {
          let otherCount = accumulator.get('Other');
          otherCount += languagePercentage;
          accumulator.set('Other', otherCount);
        } else {
          accumulator.set(language[0], languagePercentage);
        }
        return accumulator;
      }, new Map([['Other', 0]]));
      console.log(languageStatisticsPercentage);

      const languageStatisticsSorted = new Map([...languageStatisticsPercentage.entries()].sort((a, b) => {
        if (a[1] < b[1]) {
          return 1;
        }
        if (a[1] > b[1]) {
          return -1;
        }
        return 0;
      }));
      console.log(languageStatisticsSorted);
      console.log(totalLanguages);

      let languageStatisticsPieChartData = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#96db89',
              '#ff80b3',
              '#9992ff',
              '#a7e7ff'
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#96db89',
              '#ff80b3',
              '#9992ff',
              '#a7e7ff'
            ]
          }]
      };
      languageStatisticsSorted.forEach((languagePercentage, language) => {
        const languagePercentageRounded = this.round(languagePercentage);
        languageStatisticsPieChartData.labels.push(language);
        languageStatisticsPieChartData.datasets[0].data.push(languagePercentageRounded);
      });

      if ( this.state.languagesPieChartInstance ) {
        this.state.languagesPieChartInstance.destroy()
      }

      let languagesPieChart = new Chart(document.getElementById('languages-pie-chart'), {
        type: 'pie',
        data: languageStatisticsPieChartData,
        options: {
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                const value = data.datasets[0].data[tooltipItem.index];
                return data.labels[tooltipItem.index] + ': ' + value + '%';
              }
            }
          }
        }
      });

      this.setState({
        languagesPieChartInstance: languagesPieChart
      })
    }
  }

  getPercentage = (value, total) =>  value * 100 / total
  round = (num) => Math.round(num * 10) / 10

  render() {
    return (
        <div className="col-md-6 col-10">
          <h3>Languages</h3>
          <canvas id="languages-pie-chart" width="100" height="100"></canvas>
        </div>
    )
  }
}

export default LanguageStatistics
