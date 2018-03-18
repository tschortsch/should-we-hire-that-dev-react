import React from 'react'
import { withRouter } from "react-router-dom";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/fontawesome-free-brands'
import './GitHubUsernameInput.scss'

class GitHubUsernameInput extends React.Component {
  constructor({ match }) {
    super()
    this.state = {
      username: match.params.username ? match.params.username : '',
      placeholderTimeout: null,
      placeholder: 'that dev'
    }
  }

  componentDidMount() {
    this.startUsernameAnimation()
  }

  handleUsernameChange = (e) => {
    e.preventDefault()
    this.setState(
      { username: e.target.value }
    )
  }

  submitUsernameForm = (e) => {
    e.preventDefault()
    this.props.history.push('/' + this.state.username)
  }

  /**
   * Username Placeholder Animation
   */
  startUsernameAnimation = () => {
    this.clearPlaceholderTimeout()
    const placeholderTimeout = setTimeout(this.usernameAnimation, 5000);
    this.setState({
      placeholderTimeout: placeholderTimeout
    })
  }

  clearPlaceholderTimeout = () => {
    if(this.state.placeholderTimeout) {
      clearTimeout(this.state.placeholderTimeout);
      this.setState({
        placeholderTimeout: null
      })
    }
  }

  handleUsernameFocus = (e) => {
    this.clearPlaceholderTimeout()
    this.setState({
      placeholder: 'that dev'
    })
  }

  handleUsernameBlur = (e) => {
    if(e.target.value === '') {
      this.startUsernameAnimation()
    }
  }

  usernameAnimation = () => {
    new Promise((resolve) => {
      this.setState({
        placeholder: ''
      })
      this.type('tschortsch', resolve);
    }).then(() => {
      this.clearPlaceholderTimeout();
      const placeholderTimeout = setTimeout(() => {
        new Promise((resolve) => {
          this.erase(resolve);
        }).then(() => {
          new Promise((resolve) => {
            this.clearPlaceholderTimeout();
            const placeholderTimeout = setTimeout(() => {
              this.type('GitHub username', resolve);
            }, 1000);
            this.setState({
              placeholderTimeout: placeholderTimeout
            })
          }).then(() => {
            this.clearPlaceholderTimeout();
            const placeholderTimeout = setTimeout(() => {
              new Promise((resolve) => {
                this.erase(resolve);
              }).then(() => {
                this.clearPlaceholderTimeout();
                const placeholderTimeout = setTimeout(() => {
                  this.setState({
                    placeholder: 'that dev'
                  })
                }, 1000);
                this.setState({
                  placeholderTimeout: placeholderTimeout
                })
              });
            }, 2000);
            this.setState({
              placeholderTimeout: placeholderTimeout
            })
          });
        });
      }, 2000);
      this.setState({
        placeholderTimeout: placeholderTimeout
      })
    });
  }

  type = (text, resolve) => {
    let textLength = text.length;

    if(textLength > 0) {
      const nextCharacter = text.charAt(0);
      const remainingText = text.substr(1, textLength);
      this.setState({
        placeholder: this.state.placeholder + nextCharacter
      })
      this.clearPlaceholderTimeout();
      const placeholderTimeout = setTimeout(() => {
        this.type(remainingText, resolve);
      }, 300);
      this.setState({
        placeholderTimeout: placeholderTimeout
      })
    } else {
      this.clearPlaceholderTimeout();
      resolve();
    }
  }

  erase = (resolve) => {
    const currentPlaceholderText = this.state.placeholder;
    this.setState({
      placeholder: currentPlaceholderText.substr(0, currentPlaceholderText.length - 1)
    })
    if(this.state.placeholder.length > 0) {
      this.clearPlaceholderTimeout();
      const placeholderTimeout = setTimeout(() => {
        this.erase(resolve);
      }, 150);
      this.setState({
        placeholderTimeout: placeholderTimeout
      })
    } else {
      this.clearPlaceholderTimeout();
      resolve();
    }
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
                  <input type="search" name="username" id="username" className="form-control" placeholder={this.state.placeholder}
                         value={this.state.username}
                         onChange={this.handleUsernameChange}
                         disabled={this.props.isLoading}
                         onFocus={this.handleUsernameFocus}
                         onBlur={this.handleUsernameBlur}
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

export default withRouter(GitHubUsernameInput)
