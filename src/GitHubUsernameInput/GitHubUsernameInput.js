import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/fontawesome-free-brands'
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
        <form className="form-inline mb-3" onSubmit={ ! this.props.isLoading ? this.submitUsernameForm : e => e.preventDefault() }>
          <div className="form-group">
            <div className="question">
              <div className="label flex-item">Should we hire</div>
              <div className="flex-item">
                <div className="username-input-wrapper">
                  <label htmlFor="username" className="sr-only">Please enter GitHub username:</label>
                  <input type="search" name="username" id="username" className="form-control" placeholder="that dev"
                         value={this.state.username}
                         onChange={this.handleUsernameChange}
                         disabled={this.props.isLoading}
                  />
                  <div className="questionmark">?</div>
                </div>
                <p className="form-text text-muted">Enter GitHub <FontAwesomeIcon icon={faGithub}/> username</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default GitHubUsernameInput
