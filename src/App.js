import React, {useState} from 'react'
import '../src/App.css'
import { Container } from 'semantic-ui-react'
import Navigation from './Components/Navigaton';
import Profile from './Components/Profile'
import Footer from './Components/Footer'


const App = () => {
  const [profile, setProfile] = useState('Profiles')

    return(
        <Container className='main_container'>
          <Navigation/>
          <Profile setProfile={setProfile}/>
          <Footer/>
        </Container>
    )
}


export default App;
