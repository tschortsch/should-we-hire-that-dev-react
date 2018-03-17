import React from 'react';
import './bootstrap/bootstrap.scss'
import './App.scss';
import moment from 'moment'
import GitHubAuth from "./auth/GitHubAuth";
import GitHubUsernameInput from './GitHubUsernameInput/GitHubUsernameInput';
import ErrorContainer from "./ErrorContainer/ErrorContainer";
import UserInfo from "./UserInfo/UserInfo";

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      accessToken: window.localStorage.getItem('swhtd-gh-access-token'),
      isFetchingUser: false,
      userdata: null,
      errorMessage: '',
    }
  }

  fetchUserInfo = (username) => {
    this.setState({ isFetchingUser: true })
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
        this.setState({ errorMessage: this.getRateLimitReason(responseRaw.headers), isFetchingUser: false, userdata: null })
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
        this.setState({ isFetchingUser: false, userdata: null })
        return;
      }
      responseRaw.json().then((userResponse) => {
        this.setState({ isFetchingUser: false, userdata: userResponse.data.user })
        console.log(this.state.userdata)
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
      <div className="App container">
        <div className="row justify-content-center">
          <GitHubAuth accessToken={this.state.accessToken} />
          <GitHubUsernameInput fetchUserInfo={this.fetchUserInfo} isFetchingUser={this.state.isFetchingUser} />

          <div className="col-xl-8 col-lg-10 text-center">
            { this.state.errorMessage !== '' ? <ErrorContainer errorMessage={this.state.errorMessage}/> : null }
            { ! this.state.accessToken ?
              <p>
                Since the <a href="https://developer.github.com/v4/guides/resource-limitations/">GitHub API rate limits</a> are pretty low for unauthorized requests should sign in with your GitHub account first.
                The Authorization only grants this website to request data which is already public anyway. So, no worries!
              </p>
              : null }
            <UserInfo userdata={this.state.userdata} isLoading={this.state.isFetchingUser} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
