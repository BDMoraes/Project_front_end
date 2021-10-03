import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
//import User from '../components/crud/user/UserCrud'
//import Daily from '../components/crud/Daily/DailyCrud'
//import Task from '../components/crud/Task/TaskCrud'

export default props => 
    <Switch>
        <Route exact path='/' component={Home} />
        {/* <Route path='/users' component={UserCrud} /> */}
        <Redirect from='*' to='/' />
    </Switch>