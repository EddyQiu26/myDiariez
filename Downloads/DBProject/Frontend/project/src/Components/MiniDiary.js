import '../CSS/MiniDiary.css';
import DiaryForm from './DiaryForm';
import { useState } from 'react';
const MiniDiary = ({entry, userFirstname, userId}) => {
    const [showDiaryForm, setShowDiaryForm] = useState(false);
    const imgURL = entry.imgURL;
    const content = entry.content;
    const date = entry.date;
    const title = entry.title;
    //const {_id, content, date, imgURL, ownerId, recipient, signature, time, title} = entry;
    const showAddNewDiary = () => {
        setShowDiaryForm(true);
    }
    const hideAddNewDiary = () => {
        setShowDiaryForm(false);
    }
    return (
        <>
        {showDiaryForm && <DiaryForm userFirstname={userFirstname} userId={userId} hideAddNewDiary={hideAddNewDiary} isEditMode={true} entry={entry}/>}
        <div className={`miniDiaryContainer`} onClick={showAddNewDiary}>
            
            {imgURL ? (<div className='miniDiaryImageContainer' style={{backgroundImage: `url('${imgURL}')`}}></div>) : <div className='miniDiaryNoImageContainer'>NO IMAGE</div>}
            <div className='miniDiaryContentContainer'>
                <div className='miniDiaryContentHeaderContainer'>
                    <div className='miniDiaryTitle'>{title}</div>
                    <div className='miniDiaryDate'>{date}</div>
                </div>
                <div className='miniDiaryContent'>
                    {content}
                </div>
            </div>
        </div>
        </>
    )
}

export default MiniDiary
