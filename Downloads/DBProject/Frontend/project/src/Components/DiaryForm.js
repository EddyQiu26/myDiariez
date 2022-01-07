import {useState, useRef} from 'react';
import '../CSS/DiaryForm.css';
import axios from 'axios';
import s3 from 'react-s3';
import Alert from './Alert';
import {useHistory} from 'react-router-dom';
const DiaryForm = ({userFirstname='User', hideAddNewDiary, userId, isEditMode=false, entry}) => {
    const [diaryImageSrc, setDiaryImageSrc] = useState();
    const [selectedDiaryImage, setSelectedDiaryImage] = useState();
    const [title, setTitle] = useState((isEditMode && entry.title) || '');
    const [recipient, setRecipient] = useState((isEditMode && entry.recipient) || 'Diary');
    const [signature, setSignature] = useState((isEditMode && entry.signature) || userFirstname)
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    let dateRef = useRef();
    let timeRef = useRef();
    let textareaRef = useRef();
    const h = useHistory();
    const [BtnsDisabled, setBtnsDisabled] = useState(false);
    const config = {
        bucketName: 'cs4620-project-bucket',
        accessKeyId: 'AKIA5RFHY5FACKQE7W64',
        region: 'us-east-2',
        ACL: 'public-read',
        secretAccessKey: 'r6AyxXSB44D3WHmFujLV9IO4CfLJX0BYvp076V3d'
    }
    const titleHandler = e => {
        setTitle(e.target.value);
    }
    const recipientHandler = e => {
        setRecipient(e.target.value);
    }
    const signatureHandler = e => {
        setSignature(e.target.value);
    }
    const fileHandler = e => {
        setDiaryImageSrc(URL.createObjectURL(e.target.files[0]));
        setSelectedDiaryImage(e.target.files[0]);
    }
    const hideDiaryForm = e => {
        e.preventDefault();
        hideAddNewDiary(false);
    }
    const deleteEntry = () => {
        axios.delete(`/diary/delete/${entry._id}`).then((res, err) => {
            if(err){
                setAlertMessage(err.message);
                setAlertType('danger');
                return;
            }
            if(res.data.deleted){
                h.push('/home');
                h.go();
            } else {
                setAlertMessage(res.data.message);
                setAlertType('danger');
            }
        })
    }
    const submitHandler = async e => {
        e.preventDefault();
        setBtnsDisabled(true);
        if(textareaRef.current.value.length < 1) {
            setAlertMessage('Diary Content Must Not Be Empty');
            setAlertType('danger');
            setBtnsDisabled(false);
            return;
        }
        try {
            let dImageURL = null;
            const dTitle = title;
            const dDate = dateRef.current.innerText;
            const dTime = timeRef.current.innerText;
            const dRecipient = recipient;
            const dContent = textareaRef.current.value;
            const dSignature = signature;
            const ownerId = userId;
            try {
                if(isEditMode) {
                    let uploadRes;
                    if(selectedDiaryImage) {
                        s3.uploadFile(selectedDiaryImage, config).then((res, err) => {
                            if(err) {
                                setAlertMessage(err.message);
                                setAlertType('danger');
                                return;
                            }
                            dImageURL = res.location;
                            axios.put(`/diary/edit/${entry._id}`, {dTitle, dDate, dTime, dRecipient, dContent, dSignature, dImageURL, ownerId}).then(res2 => {
                                uploadRes = res2;
                                if(uploadRes.data.saved){
                                    setBtnsDisabled(false);
                                    h.push('/home');
                                    h.go();
                                } else {
                                    setAlertMessage(uploadRes.data.message);
                                    setBtnsDisabled(false);
                                    setAlertType('danger');
                                }
                            })
                        })
                    } else {
                        dImageURL = entry.imgURL;
                        axios.put(`/diary/edit/${entry._id}`, {dTitle, dDate, dTime, dRecipient, dContent, dSignature, dImageURL, ownerId}).then(res2 => {
                            uploadRes = res2;
                            if(uploadRes.data.saved){
                                setBtnsDisabled(false);
                                h.push('/home');
                                h.go();
                            } else {
                                setAlertMessage(uploadRes.data.message);
                                setBtnsDisabled(false);
                                setAlertType('danger');
                            }
                        })
                    }
                    //uploadRes = await axios.put(`/diary/edit/${entry._id}`, {dTitle, dDate, dTime, dRecipient, dContent, dSignature, dImageURL, ownerId});
                    
                } else {
                    let uploadRes;
                    if(selectedDiaryImage) {
                        s3.uploadFile(selectedDiaryImage, config).then((res, err) => {
                            if(err){
                                setAlertMessage(err.message);
                                setAlertType('danger');
                                return;
                            }
                            dImageURL = res.location;
                            axios.post('/diary/upload', {dTitle, dDate, dTime, dRecipient, dContent, dSignature, dImageURL, ownerId}).then(res2 => {
                                uploadRes = res2;
                                if(uploadRes.data.saved){
                                    console.log('upload res: ', uploadRes);
                                    setBtnsDisabled(false);
                                    h.push('/home');
                                    h.go();
                                } else {
                                    setAlertMessage(uploadRes.data.message);
                                    setBtnsDisabled(false);
                                    setAlertType('danger');
                                }
                            })
                        })
                    } else {
                        axios.post('/diary/upload', {dTitle, dDate, dTime, dRecipient, dContent, dSignature, dImageURL, ownerId}).then(res2 => {
                            uploadRes = res2;
                            if(uploadRes.data.saved){
                                console.log('upload res: ', uploadRes);
                                setBtnsDisabled(false);
                                h.push('/home');
                                h.go();
                            } else {
                                setAlertMessage(uploadRes.data.message);
                                setBtnsDisabled(false);
                                setAlertType('danger');
                            }
                        })
                    }
                }
            } catch(e) {
                setAlertMessage(e.message);
                setAlertType('danger')
                setBtnsDisabled(false);
            }
        } catch(e) {
            setAlertMessage(e.message);
            setAlertType('danger');
            setBtnsDisabled(false);
        }
    }
    return (
        <div className='diaryFormContainer'>
            <div className='diaryForm'>
                <form className='diaryFormComp'>
                    <div className='diaryFormGroup diaryTitle'>
                        <div className='label titleLabel'>
                            <label htmlFor='diaryTitle' className='diaryDetails'>Diary Title</label>
                        </div>    
                        <div className='titleInputField'>
                            {isEditMode ? (<input type='text' name='diaryTitle' id='diaryTitle' className='diaryInputs' onChange={titleHandler} value={title}></input>) : 
                                (<input type='text' name='diaryTitle' id='diaryTitle' className='diaryInputs' onChange={titleHandler} value={title}></input>)}
                        </div>
                    </div>  
                    <div className='diaryDate diaryFormGroup'>
                        {isEditMode ? (<span ref={dateRef} className='diaryDetails'>{entry.date}</span>) : 
                            (<span ref={dateRef} className='diaryDetails'>{(new Date()).toDateString()}</span>)}
                    </div>  
                    <div className='diaryFormGroup diaryTimeStamp'>
                        {isEditMode ? (<span ref={timeRef} className='diaryDetails'>{`${entry.time}`}</span>) : 
                            (<span ref={timeRef} className='diaryDetails'>{`${(new Date()).toLocaleTimeString()}`}</span>)}
                    </div>
                    <div className='diaryFormGroup diaryGreeting'>
                        <span className='diaryDetails'>Dear {isEditMode ? (<input className='diaryInputs recipientInput' name='diaryRecipient' onChange={recipientHandler} value={recipient}/>) : 
                            (<input className='diaryInputs recipientInput' name='diaryRecipient' onChange={recipientHandler} value={recipient}/>)},</span>
                    </div>
                    <div className='content diaryContentContainer'>
                        <div className='diaryContentWrapper'>
                            {isEditMode ? (<textarea className='diaryTextArea' ref={textareaRef} defaultValue={entry.content} required></textarea>) : 
                                (<textarea className='diaryTextArea' ref={textareaRef} required></textarea>)}
                        </div>
                        <div className='diarySideContent'>
                            <div className='diaryImageUploader'>
                                <div className='diaryImageContainer'>
                                    <img src={diaryImageSrc} className='diaryImage' alt=''/>
                                </div>
                                <input type='file' onChange={fileHandler} name='diaryImage' accept='image/*' size="1048576" className='diaryImageInput'/>
                            </div>
                            <div className='diaryBtnGroup'>
                                <div className='diaryBtns'><button className='cancelBtn Btns' onClick={hideDiaryForm} disabled={BtnsDisabled}>Cancel</button></div>
                                {isEditMode && (<div className='diaryBtns'><button className='deleteBtn Btns' onClick={deleteEntry} disabled={BtnsDisabled}>Delete</button></div>)}
                                <div className='diaryBtns'><button className='addBtn Btns' onClick={submitHandler} disabled={BtnsDisabled}>{isEditMode ? 'Update' : 'Add'}</button></div>
                            </div>
                        </div>
                    </div>
                    <div className='diarySignature'>
                        {isEditMode ? (<span className='diaryDetails'><input className='diaryInputs signatureInput' name='diarySignature' value={signature} onChange={signatureHandler}/></span>) : 
                            (<span className='diaryDetails'><input className='diaryInputs signatureInput' name='diarySignature' value={signature} onChange={signatureHandler}/></span>)}
                        <span className='alertWrapper'>{alertMessage && <Alert type={alertType} message={alertMessage}/>}</span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DiaryForm
