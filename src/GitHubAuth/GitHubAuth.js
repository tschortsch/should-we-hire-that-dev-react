import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/fontawesome-free-solid'
import { faGithub } from '@fortawesome/fontawesome-free-brands'
import './GitHubAuth.scss'

class GitHubAuth extends React.Component {
  handleAuth(e) {
    window.location.href = './github-auth.php';
    e.preventDefault();
  }

  render() {
    return (
      <div className="col-12 text-right">
        { ! this.props.accessToken ?
          <button className="btn btn-primary btn-sm" onClick={ this.handleAuth }>Authorize with GitHub <FontAwesomeIcon icon={faGithub}/></button>
          :
          <button className="btn btn-link btn-sm">Logout from GitHub <FontAwesomeIcon icon={faSignOutAlt}/></button>
        }
      </div>
    )
  }
}

export default GitHubAuth
