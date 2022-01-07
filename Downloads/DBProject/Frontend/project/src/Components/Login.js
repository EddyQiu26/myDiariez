import React, {useState, useEffect, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios';
import '../CSS/Login.css'
import Alert from './Alert';
import Loader from './Loader';

const Login = () => {
    let hist = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [resMessage, setResMessage] = useState('');
    const [resMessageType, setResMessageType] = useState();
    const [loginBtnDisabled, setLoginBtnDisabled] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const timeoutID = useRef();
    useEffect(() => {
        return () => {
            clearTimeout(timeoutID.current)
        }
    },[])
    const handleChange = e => {
        const val = e.target.value;
        switch(e.target.name){
            case "username": 
                setFormData(prev => {return {...prev, username: val}});
                break;
            case "password":
                setFormData(prev => {return {...prev, password: val}});
                break;
            default: break;
        }
    }

    const submit = async e => {
        const past = Date.now();
        e.preventDefault();
        const {username, password} = formData;
        setLoginBtnDisabled(true);
        setIsLoading(true);
        try {
            const res = await axios.post('/user/login', {username, password});
            setResMessage(res.data.message);
            if(res.data.isAuth) {
                const now = Date.now();
                if(now - past >= 600){
                    setResMessageType('success');
                    hist.push('/home');
                    hist.go();
                } else {
                    timeoutID.current = setTimeout(() => {
                        setResMessageType('success');
                        hist.push('/home');
                        hist.go();
                    }, 600)
                }
            } else {
                const now = Date.now();
                if(now - past >= 600){
                    setIsLoading(false);
                    setLoginBtnDisabled(false);
                    setResMessageType('danger')
                } else {
                    timeoutID.current = setTimeout(() => {
                        setIsLoading(false);
                        setLoginBtnDisabled(false);
                        setResMessageType('danger')
                    }, 600)
                }
            }
        } catch(err) {
            setLoginBtnDisabled(false);
            setResMessageType('danger')
            setResMessage(err.message);
        }
    }
    return (
        isLoading ? <Loader /> : <div className='loginContainer'>
        <div className="loginFormContainer">
        <h2 className='loginHeader'>Sign In</h2>
        {resMessage && <Alert type={resMessageType} message={resMessage} />}
        <form onSubmit={submit} className='loginForm'>
            <div className='formGroup'>
                <div className="loginLabelContainer">
                    <label htmlFor='loginUsername' className='loginLabel'>Username</label>
                </div>
                <input className='loginInput' type="email" id='loginUsername' name='username' placeholder='Email address' value={formData.username} onChange={handleChange} required/>
            </div>
            <div className='formGroup'>
                <div className="loginLabelContainer">
                    <label htmlFor="loginPassword" className='loginLabel'>Password</label>
                </div>
                <input className='loginInput' type="password" id='loginPassword' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required/>
            </div>
            <div className='formGroup'>
                <button type='submit' className='loginBtn' disabled={loginBtnDisabled}>Log in</button>
            </div>
        </form>
        </div>
    </div>
    )
}

export default Login