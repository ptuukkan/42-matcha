import React, {useState} from 'react'
import '../src/App.css'
import { Container } from 'semantic-ui-react'
import Navigation from './Components/Navigaton';
import Profile from './Components/Profile'
import Register from './Components/Register'
import Login from './Components/Login'
import Settings from './Components/Settings'
import Browse from './Components/Browse'
import Chat from './Components/Chat'
import Footer from './Components/Footer'
import Profiles from './testProfiles1.json'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

/****GETRANDOMUSER IS TEST FUNCTION */

const App = () => {
  const [profile, setProfile] = useState(Profiles.profiles[0])
  
  const getRandomUser = () => {
    let i = Math.floor(Math.random() * Profiles.profiles.length)
    setProfile(Profiles.profiles[i])
  }

    return(
        <Container className='main_container'>
          <Router>
          <Navigation/>
          <Switch>
            <Route exact path='/chat'>
              <Chat/>
            </Route>
            <Route exact path='/settings'>
              <Settings user={profile}/>
            </Route>
            <Route exact path='/profile'>
              <Profile getProfile={getRandomUser} user={profile}/>
            </Route>
            <Route exact path='/browse'>
              {/**Profiles.profiles.map(user => <Browse key={user.address.latitude - Date.now()} users={user}/>)**/}
              <Browse users={Profiles.profiles}/>
            </Route>
            <Route exact path='/register'>
              <Register/>
            </Route>
            <Route exact path='/login'>
              <Login/>
            </Route>
          </Switch>
          </Router>
          <Footer/>
        </Container>
    )
}


export default App;
