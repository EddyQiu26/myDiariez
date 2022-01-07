import '../CSS/Overlay.css';
import React, {useState} from 'react';

const Overlay = () => {
    const [switchForm, setSwitchForm] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const changeForm = () => {
        setIsInitialLoad(false)
        setSwitchForm(prev => !prev);
    }
    let initialFormAnimation = isInitialLoad ? '' : 'initFormAnimation';
    return (
        <div className={`formOverlay ${switchForm ? 'switchFormAnimationPrimary' : initialFormAnimation}`}>
            <div className="overlayContent">
                <div className="overlayText">
                    <h2>{`${switchForm ? 'Sign In to Start Creating Your Diary' : 'Create an Account to Try Our Online Diary App, It Is Free!'}`}</h2>
                </div>
                <div className="overlayBtnContainer">
                    <button type='button' onClick={changeForm} className={`overlayBtn ${switchForm ? 'switchFormAnimationSecondary' : ''}`}>{switchForm ? 'Sign In' : 'Create an Account'}</button>
                </div>
            </div>
        </div>
    )
}

export default Overlay