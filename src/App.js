import React from 'react';
import './bootstrap/bootstrap.scss'
import './App.scss';
import moment from 'moment'
import GitHubAuth from "./auth/GitHubAuth";
import GitHubUsernameInput from './GitHubUsernameInput/GitHubUsernameInput';
import ErrorContainer from "./ErrorContainer/ErrorContainer";
import UserInfo from "./UserInfo/UserInfo";
import Statistics from './Statistics/Statistics'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      accessToken: window.localStorage.getItem('swhtd-gh-access-token'),
      isLoading: false,
      userdata: null,
      commitsTotalCount: 0,
      errorMessage: '',
    }
  }

  fetchUserInfo = (username) => {
    this.setState({ isLoading: true, userdata: null })
    const query = `
    query {
        user(login: "${username}") {
            name,
            location,
            avatarUrl,
            bio,
            createdAt,
            url,
            followers {
                totalCount
            },
            organizations {
                totalCount
            },
            repositories(first: 100) {
                totalCount,
                nodes {
                    stargazers {
                        totalCount
                    }
                }
            },
            repositoriesContributedTo(first: 100) {
                totalCount,
                nodes {
                    languages(first: 10) {
                        edges {
                            size,
                            node {
                                name
                            }
                        },
                    }
                }
            },
        }
    }`;
    let userCheckPromise = this.doGraphQlQuery( query )

    userCheckPromise.then((responseRaw) => {
      if (this.rateLimitExceeded(responseRaw.headers)) {
        this.setState({ errorMessage: this.getRateLimitReason(responseRaw.headers), isLoading: false, userdata: null })
        return;
      }
      if (!responseRaw.ok) {
        if (responseRaw.status === 401) {
          this.setState({ errorMessage: 'Something is wrong with your access_token. Please login again.' })
          this.removeAccessTokenFromLocalStorage();
        } else if (responseRaw.status === 404) {
          this.setState({ errorMessage: 'User not found. Try another username.' })
        } else {
          this.setState({ errorMessage: 'Something went wrong!' })
        }
        this.setState({ isLoading: false, userdata: null })
        return;
      }
      responseRaw.json().then((userResponse) => {
        this.setState({ userdata: userResponse.data.user })
        console.log(this.state.userdata)

        // TODO replace with graphql query
        let fetchCommitsPromise = new Promise((resolve, reject) => {
          this.fetchCommits(username).then(commitsResponseRaw => {
            if(this.rateLimitExceeded(commitsResponseRaw.headers)) {
              reject(new Error(this.getRateLimitReason(commitsResponseRaw.headers)));
            }
            commitsResponseRaw.json().then(commitsResponse => {
              this.setState({ commitsTotalCount: commitsResponse.total_count })
              resolve();
            });
          });
        }).catch(reason => {
          this.setState({ errorMessage: reason })
        });

        fetchCommitsPromise.then(() => {
          //fillRankingContainer(rankingContainer, overallRanking, maxRanking);
          this.setState({ isLoading: false })
        });
      })
    })
  }

  doGraphQlQuery = (query) => {
    const ghGraphQlEndpointUrl = 'https://api.github.com/graphql';
    return fetch(ghGraphQlEndpointUrl, {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: new Headers({
        'Authorization': 'bearer ' + this.state.accessToken
      })
    });
  }

  fetchCommits = (username) => {
    let commitQueryUrl = 'https://api.github.com/search/commits?q=author:' + username + '&sort=author-date&order=desc&per_page=1';
    if(this.state.accessToken) {
      commitQueryUrl += '&access_token=' + this.state.accessToken;
    }
    return fetch(commitQueryUrl, {
      headers: {
        'Accept': 'application/vnd.github.cloak-preview'
      }
    });
  }

  rateLimitExceeded = (headers) => {
    const rateLimit = headers.get('X-RateLimit-Remaining');
    return rateLimit && rateLimit <= 0;
  }

  getRateLimitReason = (headers) => {
    let reason = 'Your rate limit is exceeded. You have to login with GitHub to do another request.';
    const rateLimitReset = headers.get('X-RateLimit-Reset');
    if(rateLimitReset) {
      reason = 'Your rate limit is exceeded. You have to wait till ' + moment.unix(rateLimitReset).format('DD.MM.YYYY HH:mm:ss') + ' to do another request.';
    }
    return reason;
  }

  removeAccessTokenFromLocalStorage = () => {
    window.localStorage.removeItem('swhtd-gh-access-token');
    this.setState({ accessToken: false })
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row justify-content-center">
            <GitHubAuth accessToken={this.state.accessToken} />
            <GitHubUsernameInput fetchUserInfo={this.fetchUserInfo} isLoading={this.state.isLoading} />

            <div className="col-xl-8 col-lg-10 text-center">
              { this.state.errorMessage !== '' ? <ErrorContainer errorMessage={this.state.errorMessage}/> : null }
              { ! this.state.accessToken ?
                <p>
                  Since the <a href="https://developer.github.com/v4/guides/resource-limitations/">GitHub API rate limits</a> are pretty low for unauthorized requests should sign in with your GitHub account first.
                  The Authorization only grants this website to request data which is already public anyway. So, no worries!
                </p>
                : null }
              <UserInfo userdata={this.state.userdata} isLoading={this.state.isLoading} />
              { this.state.userdata || this.state.isLoading ?
                <Statistics userdata={this.state.userdata} commitsTotalCount={this.state.commitsTotalCount} />
                : null
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
