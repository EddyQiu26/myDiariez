import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import '../CSS/Register.css'
import Alert from './Alert';
import Loader from './Loader';

const Register = () => {
    const [resMessage, setResMessage] = useState('');
    const [pwdLengthSatisfied, setPwdLengthSatisfied] = useState(false);
    const [pwdsMatchSatisfied, setPwdMatchSatisfied] = useState(false);
    const [pwdCleanSatisfied, setPwdCleanSatisfied] = useState(true);
    const [resMessageType, setResMessageType] = useState();
    const [RegBtnDisabled, setRegBtnDisabled] = useState(false);
    const passwordRef = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const confirmPasswordRef = useRef(false);
    const timeoutRef = useRef();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        }
    }, [])
    const checkPwdCleanness = () => {
        const currentPwdVal = passwordRef.current.value;
        if(currentPwdVal.length > 0){
            if(
                currentPwdVal.charAt(currentPwdVal.length - 1) === '~' || 
                currentPwdVal.charAt(currentPwdVal.length - 1) === '`' || 
                currentPwdVal.charAt(currentPwdVal.length - 1) === '{' || 
                currentPwdVal.charAt(currentPwdVal.length - 1) === '}' || 
                currentPwdVal.charAt(currentPwdVal.length - 1) === '|' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === '[' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === ']' ||  
                currentPwdVal.charAt(currentPwdVal.length - 1) === '\\' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === ';' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === ':' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === '"' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === '\'' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === '/' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === '<' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === '>' ||  
                currentPwdVal.charAt(currentPwdVal.length - 1) === '(' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === ')' ||
                currentPwdVal.charAt(currentPwdVal.length - 1) === ','        
            ) {setPwdCleanSatisfied(false)}
            else {setPwdCleanSatisfied(true)}
        } else{setPwdCleanSatisfied(true)}
    }
    const checkPwdLength = () => {
        if(passwordRef.current.value.length > 7) {
            setPwdLengthSatisfied(true);
        } else {
            setPwdLengthSatisfied(false);
        }
        if(passwordRef.current.value === confirmPasswordRef.current.value && passwordRef.current.value.length > 0 && confirmPasswordRef.current.value.length > 0){
            setPwdMatchSatisfied(true);
        } else {
            setPwdMatchSatisfied(false)
        }
    }
    const checkPwdsMatch = () => {
        if(passwordRef.current.value === confirmPasswordRef.current.value && passwordRef.current.value.length > 0 && confirmPasswordRef.current.value.length > 0){
            setPwdMatchSatisfied(true);
        } else {
            setPwdMatchSatisfied(false)
        }
    } 
    const handleChange = e => {
        const val = e.target.value;
        switch(e.target.name) {
            case "firstName":
                setFormData(prev => {return {...prev, firstName: val}});
                break;
            case "lastName":
                setFormData(prev => {return {...prev, lastName: val}});
                break;
            case "username":
                setFormData(prev => {return {...prev, username: val}});
                break;
            case "password":
                checkPwdLength();
                checkPwdCleanness();
                setFormData(prev => {return {...prev, password: val}});
                break;
            case "confirmPassword":
                checkPwdsMatch();
                setFormData(prev => {return {...prev, confirmPassword: val}});
                break;
            default: break;
        }
        
    }
    const submit = async e => {
        const past = Date.now();
        e.preventDefault();
        setRegBtnDisabled(true);
        setIsLoading(true)
        const {firstName, lastName, username, password, confirmPassword} = formData;
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmPassword: ''
        })
        setPwdLengthSatisfied(false);
        setPwdMatchSatisfied(false);
        setPwdCleanSatisfied(true);
        try {
            const res = await axios.post('/user/register', {firstName, lastName, username, password, confirmPassword});
            setResMessage(res.data.message);
            if(!res.data.registered){
                const now = Date.now();
                if(now - past >= 600){
                    setRegBtnDisabled(false);
                    setResMessageType('danger');
                    setIsLoading(false);
                } else {
                    timeoutRef.current = setTimeout(() => {
                        setRegBtnDisabled(false);
                        setResMessageType('danger');
                        setIsLoading(false);
                    }, 600)
                }
            } else {
                const now = Date.now();
                if(now - past >= 600){
                    setRegBtnDisabled(false);
                    setResMessageType('success');
                    setIsLoading(false);
                } else {
                    timeoutRef.current = setTimeout(() => {
                        setRegBtnDisabled(false);
                        setResMessageType('success');
                        setIsLoading(false);
                    }, 600)
                }
            }
        } catch(err) {
            setRegBtnDisabled(false);
            setIsLoading(false);
            setResMessageType('danger');
            setResMessage(err.message);
        }
    }
    return (
        isLoading ? <Loader /> : <div className='regFormContainer'>
        <h2 className='regHeader'>Sign Up Now, It Is Free!</h2>
        {resMessage && <Alert type={resMessageType} message={resMessage} />}
        <form onSubmit={submit} className='regForm'>
            <div className='formGroup rowGroup'>
                <div className='rowContainer'>
                    <div className='regLabelContainer'>
                        <label htmlFor='regFirstname' className='regLabel'>First name</label>
                    </div>
                    <input className='regInput' id='regFirstname' type="text" name='firstName' placeholder='First name' onChange={handleChange} value={formData.firstName} required/>  
                </div>
                <div className='rowContainer'>
                    <div className='regLabelContainer'>
                        <label htmlFor='regLastname' className='regLabel'>Last name</label>
                    </div>
                    <input className='regInput' id='regLastname' type="text" name='lastName' placeholder='Last name' onChange={handleChange} value={formData.lastName} required/>
                </div>
            </div>
            <div className='formGroup'> 
                <div className='regLabelContainer'>
                    <label htmlFor='regEmail' className='regLabel'>Email</label>
                </div>               
                <input className='regInput' id='regEmail' type="email" name='username' placeholder='email@email.com' onChange={handleChange} value={formData.username} required/>
            </div>
            <div className='formGroup'>
                <div className='spRow'>
                    <div className='rowContainer'>
                        <div className='regLabelContainer'>
                            <label htmlFor='regPassword' className='regLabel'>Password</label>
                        </div>                
                        <input ref={passwordRef} className='regInput' id='regPassword' type="password" name='password' placeholder='Password' onChange={handleChange} value={formData.password} required/>
                    </div>
                    <div className='rowContainer'>
                        <div className='regLabelContainer'>
                            <label htmlFor='regPasswordConfirm' className='regLabel'>Confirm Password</label>
                        </div>                
                        <input ref={confirmPasswordRef} className='regInput' id='regPasswordConfirm' type="password" name='confirmPassword' placeholder='Confirm Password' onChange={handleChange} value={formData.confirmPassword} required/>
                    </div>
                </div>
                <div className='pwdNotesContainer'>
                    <p className={`pwdNotes lengthNote ${pwdLengthSatisfied ? 'pwdReqSatisfied' : ''}`}>Contains at least 8 characters</p>
                    <p className={`pwdNotes pwdMatchNote ${pwdsMatchSatisfied ? 'pwdReqSatisfied' : ''}`}>Passwords match</p>
                    <p className={`pwdNotes illegalCharNote ${pwdCleanSatisfied ? 'pwdReqSatisfied' : 'pwdNotClean'}`}>Free of the following illegal characters: ",{'<>'}:;'()/[]\{'{}'}|`~</p>
                </div>
            </div>
            
            <div>
                <button type='submit' className='regBtn' disabled={RegBtnDisabled}>Sign Up</button>
            </div>
        </form>
    </div>
    )
}

export default Register