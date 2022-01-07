import '../CSS/Home.css';
import { useState, useEffect, useRef } from 'react';
import MiniDiary from './MiniDiary';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import DiaryForm from './DiaryForm';
import axios from 'axios';
import FilterForm from './FilterForm';
const Home = ({userFirstname, userId}) => {
    const [showDiaryForm, setShowDiaryForm] = useState(false);
    const [showFilterForm, setShowFilterForm] = useState(false);
    const [entries, setEntries] = useState([]);
    const [filterMode, setFilterMode] = useState(false);
    const entriesRef = useRef([]);
    const showAddNewDiary = () => {
        setShowDiaryForm(true);
    }
    const hideAddNewDiary = () => {
        setShowDiaryForm(false);
    }
    const showFilterDiary = () => {
        setFilterMode(true);
        setShowFilterForm(true);
    }
    const hideFilterDiary = () => {
        setShowFilterForm(false);
    }
    useEffect(() => {
        const getAllEntries = async () => {
            const res = await axios.get('/diary/entries', {
                withCredentials: true
            });
            if(res.data.successful) {
                entriesRef.current = res.data.entries;
                setEntries(res.data.entries);
            } else {
                alert(res.data.message);
            }
        }
        getAllEntries();
    }, [])
    return (
        <div className='homeContainer'>
            <div className='manipButtonContainer'>
                <button onClick={showAddNewDiary} className='manipIcons addIconBtn'><AddIcon />Add</button>
                {filterMode ? <button onClick={() => {setEntries(entriesRef.current); setFilterMode(false)}} className='manipIcons clearFilterBtn'><ClearIcon />Clear Filter</button> : <button onClick={showFilterDiary} className='manipIcons filterIconBtn'><FilterAltIcon />Filter</button>}
            </div>
            {showDiaryForm && <DiaryForm userFirstname={userFirstname} userId={userId} hideAddNewDiary={hideAddNewDiary}/>}
            {showFilterForm && <FilterForm hideFilterDiary={hideFilterDiary} setFilterMode={setFilterMode} userId={userId} setEntries={setEntries}/>}
            <div className='diaryContainer'>
                {entries.map((entry) => {
                    return <MiniDiary userFirstname={userFirstname} userId={userId} entry={entry} key={entry._id}/>
                })}
            </div>
        </div>
    )
}

export default Home
