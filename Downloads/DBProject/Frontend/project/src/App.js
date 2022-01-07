//import Up from './Components/Up'
import {useState} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Auth from './Components/Auth';
import Home from './Components/Home';
import './CSS/default.css';
import Header from './Components/Header';
import {useEffect} from 'react';
import axios from 'axios';
import Loader from './Components/Loader';
function App() {
  const [canLoadPage, setCanLoadPage] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState();
  const [userFirstName, setUserFirstName] = useState();
  useEffect(() => {
    let timeoutID;
    const past = Date.now();
    const checkLogInStatus = async () => {
      const res = await axios.get('/user/login', {withCredentials: true});
      const now = Date.now();
      if(res.data.isAuth) {
        if(now - past >= 600) {
          setUserFirstName(res.data.firstName);
          setUserId(res.data.id);
          setIsSignedIn(true);
          setCanLoadPage(true)
        } else {
          timeoutID = setTimeout(()=>{
            setUserFirstName(res.data.firstName);
            setUserId(res.data.id);
            setIsSignedIn(true);
            setCanLoadPage(true);
          }, 600)
        }
      } else {
        if(now - past >= 600) {
          setCanLoadPage(true)
        } else {
          timeoutID = setTimeout(()=>{
            setCanLoadPage(true);
          }, 600)
        }
      }
    }
    checkLogInStatus();
    return () => {
      clearTimeout(timeoutID);
    }
  }, [])
  return (
    canLoadPage ? (
    <BrowserRouter>
      {isSignedIn ? <Header userFirstName={userFirstName} isSignedIn={isSignedIn}/> : <Header/>}
      <Switch>
        <Route exact path='/'>
          {isSignedIn ? <Redirect to='/home' /> : <Auth />}
          {/* {isSignedIn ? <Redirect to='/home' /> : <Home />} */}
        </Route>
        <Route path='/home'>
          {/* {isSignedIn ? <Home userFirstname={userFirstName} userId={userId}/>: <Redirect to='/' exact/>} */}
          {isSignedIn ? <Home userFirstname={userFirstName} userId={userId}/>: <Auth/>}
        </Route>
      </Switch>
    </BrowserRouter>
    ) : <Loader/>
  );
}

export default App;
