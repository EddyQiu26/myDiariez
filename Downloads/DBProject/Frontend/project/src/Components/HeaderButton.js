import '../CSS/HeaderButton.css';
import {useHistory} from 'react-router-dom';
import axios from 'axios'

const HeaderButton = ({userFirstName}) => {
    const h = useHistory();
    const signOut = async () => {
        const res = await axios.post('/user/signoff', {withCredentials: true});
        if(res.data.signedOff){
            h.push('/');
            h.go();
        }
    }
    return (
        <button className='headerBtnContainer' onClick={signOut}>
            <div className='headerBtnTextContainer'>
                <span className='headerBtnText headerText1'>Hello {userFirstName}</span>
                <span className='headerBtnText headerText2'>Sign Out</span>
            </div>
        </button>
    )
}

export default HeaderButton
