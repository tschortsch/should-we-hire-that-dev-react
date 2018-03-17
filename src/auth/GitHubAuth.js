import React from 'react'

class GitHubAuth extends React.Component {
  handleAuth(e) {
    window.location.href = './github-auth.php';
    e.preventDefault();
  }

  render() {
    return (
      <div className="col-12 text-right">
        { ! this.props.accessToken ?
          <button className="btn btn-primary btn-sm" onClick={ this.handleAuth }>Authorize with GitHub <i className="fab fa-github" aria-hidden="true"></i></button>
          :
          <button className="btn btn-link btn-sm">Logout from GitHub <i className="fas fa-sign-out-alt" aria-hidden="true"></i></button>
        }
      </div>
    )
  }
}

export default GitHubAuth
