import '../CSS/Header.css';
import HeaderButton from './HeaderButton';

const Header = ({userFirstName, isSignedIn}) => {
    return isSignedIn ? (
        <div id='header'>
            <div className='logoContainer'><span id='headerText'>MyDiariez</span></div>
            <HeaderButton userFirstName={userFirstName}/>
        </div>
    ) : (
        <div id='header'>
            <div className='logoContainer'><span id='headerText'>MyDiariez</span></div>
        </div>
    );
}

export default Header