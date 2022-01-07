import Login from './Login';
import Register from './Register';
import '../CSS/Auth.css'
import Overlay from './Overlay'
const Auth = () => {
    return (
        <div className='formContainer'>
            <div className='mainForms'>
                <Overlay />
                <Login className='loginFormComp' />
                <Register className='regFormComp'/>
            </div>
        </div>
    )
}

export default Auth