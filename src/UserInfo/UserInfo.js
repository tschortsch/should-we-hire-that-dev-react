import React from 'react'
import './UserInfo.scss'

const UserInfo = ({userdata, isLoading}) => (
  <div id="avatar-container" className="buffer-bottom">
    <div id="loading-container" className={ isLoading ? 'loading' : '' }></div>
    { userdata && ! isLoading ?
      <div>
        <div id="avatar-wrapper">
          <img src={userdata.avatarUrl} alt={userdata.name} />
        </div>
        <h2><a href={userdata.url} id="url">{userdata.name}</a></h2>
        <p className="text-muted"><i className="fas fa-map-marker-alt" aria-hidden="true"></i> {userdata.location}</p>
        <p>{userdata.bio}</p>
      </div>
    : null }
  </div>
)

export default UserInfo