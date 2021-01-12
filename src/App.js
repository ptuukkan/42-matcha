import React, {useState} from 'react'
import '../src/App.css'
import { Container } from 'semantic-ui-react'
import Navigation from './Components/Navigaton';
import Profile from './Components/Profile'
import Settings from './Components/Settings'
import Browse from './Components/Browse'
import Chat from './Components/Chat'
import Footer from './Components/Footer'
import Profiles from './testprofiles.json'
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
              <Browse user={Profiles.profiles}/>
            </Route>
          </Switch>
          </Router>
          <Footer/>
        </Container>
    )
}


export default App;
