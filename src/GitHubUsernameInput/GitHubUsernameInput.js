import React from 'react'
import './GitHubUsernameInput.scss'

class GitHubUsernameInput extends React.Component {
  constructor() {
    super()
    this.state = {
      username: ''
    }
  }

  handleUsernameChange = (e) => {
    e.preventDefault()
    this.setState(
      { username: e.target.value }
    )
  }

  submitUsernameForm = (e) => {
    e.preventDefault()
    this.props.fetchUserInfo(this.state.username)
  }

  render() {
    return (
      <div className="col-xl-8 col-lg-10">
        <form className="form-inline mb-1" onSubmit={ ! this.props.isFetchingUser ? this.submitUsernameForm : e => e.preventDefault() }>
          <div className="form-group">
            <div className="question">
              <div className="label flex-item">Should we hire</div>
              <div className="flex-item">
                <div className="username-input-wrapper">
                  <label htmlFor="username" className="sr-only">Please enter GitHub username:</label>
                  <input type="search" name="username" id="username" className="form-control" placeholder="that dev"
                         value={this.state.username}
                         onChange={this.handleUsernameChange}
                         disabled={this.props.isFetchingUser}
                  />
                  <div className="questionmark">?</div>
                </div>
                <p className="form-text text-muted">Enter GitHub <i className="fab fa-github" aria-hidden="true"></i> username</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default GitHubUsernameInput
