import React from 'react'

import Navbar from './Navbar'
import Footer from './Footer'

import UserStore from '../stores/UserStore'
import UserActions from '../actions/UserActions'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedInUserId: ''
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange (state) {
    this.setState(state)
  }

  componentDidMount () {
    UserStore.listen(this.onChange)
    UserActions.loginUser()
  }

  componentWillUnmount () {
    UserStore.unlisten(this.onChange)
  }

  // Temporary Login function. User register and login forms will be implemented on part 3
  LOGIN_DEFAULT_USER () {
    let request = {
      url: '/user/login',
      method: 'post',
      data: JSON.stringify({ username: 'admin', password: 'admin' }),
      contentType: 'application/json'
    }
    $.ajax(request)
      .done(userId => {
        this.setState({
          loggedInUserId: userId
        })
      })
      .fail(err => {
        console.log('UserMenu: err', err)
        this.setState({
          loggedInUserId: '',
          message: err.responseJSON.message
        })
      })
  }

  logoutUser () {
    let request = {
      url: '/user/logout',
      method: 'post'
    }
    $.ajax(request)
      .done(() => {
        this.setState({
          loggedInUserId: ''
        })
      })

      .fail(err => {
        this.setState({
          error: err.responseJSON.message
        })
      })
  }

  render () {
    let userData = {
      loggedInUserId: this.state.loggedInUserId,
      loginUser: this.LOGIN_DEFAULT_USER,
      logoutUser: this.logoutUser.bind(this)
    }
    return (
      <div>
        <Navbar history={this.props.history} userData={userData}/>
        {this.props.children}
        <Footer />
      </div>
    )
  }
}