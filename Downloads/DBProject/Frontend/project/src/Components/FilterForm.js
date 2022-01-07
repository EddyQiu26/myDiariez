import '../CSS/FilterForm.css';
import { useState } from 'react';
import axios from 'axios';
import Alert from './Alert';

const FilterForm = ({hideFilterDiary, userId, setEntries, setFilterMode}) => {
    const currentYear = (new Date()).getFullYear();
    const currentMonth = (new Date()).getMonth() + 1;
    let currentDay = (new Date()).getDate();
    if(currentDay < 10) {
        currentDay = ('0').toString().concat(currentDay);
    }
    const [alert, setAlert] = useState({
        showAlert: false,
        alertType: '',
        alertMsg: ''
    });
    const [fieldSelect, setFieldSelect] = useState('both');
    const [fieldScopeSelect, setFieldScopeSelect] = useState('contains');
    const [keywords, setKeywords] = useState('');
    const [filterCategory, setFilterCategroy] = useState('all');
    const [filterCategoryController, setFileterCategroyController] = useState({
        titleContentOff: false,
        dateOff: false,
    })
    const [dateSelectFrom, setDateSelectFrom] = useState( (new Date(`${currentYear}-${currentMonth}-${currentDay}`)).toISOString() );
    const [dateSelectTo, setDateSelectTo] = useState( (new Date(`${currentYear}-${currentMonth}-${currentDay}`)).toISOString() );
    const defineFilterGroup = e => {
        switch(e.target.value) {
            case "all":
                setFileterCategroyController({titleContentOff: false, dateOff: false})
                setFilterCategroy('all')
                break;
            case "tc": 
                setFileterCategroyController({titleContentOff: false, dateOff: true})
                setFilterCategroy('tc')
                break;
            case "date": 
                setFileterCategroyController({titleContentOff: true, dateOff: false})
                setFilterCategroy('date')
                break;
            default: break;
        }
    }
    const defineFieldScopeSelection = e => {
        setFieldScopeSelect(e.target.value);
    }
    const updateKeywords = e => {
        setKeywords(e.target.value);
    }
    const defineFieldSelection = e => {
        setFieldSelect(e.target.value);
    }
    const defineDateSelectFrom = e => {
        setDateSelectFrom(e.target.value)
    }
    const defineDateSelectTo = e => {
        setDateSelectTo(e.target.value)
    }
    const submitHandler = async e => {
        e.preventDefault();
        try {
            if(filterCategory === 'all' || filterCategory === 'tc'){
                if(keywords.length < 1){
                    setAlert({
                        showAlert: true,
                        alertMsg: "Keywords must not be empty",
                        alertType: "danger"
                    })
                    return;
                }
            }
            if(filterCategory === 'date' || filterCategory === 'all'){
                if(dateSelectFrom >= dateSelectTo){
                    setAlert({
                        showAlert: true,
                        alertMsg: "Invalid date range",
                        alertType: "danger"
                    })
                    return;
                }
            }
            const res = await axios.post('/diary/filter', {fieldScopeSelect, fieldSelect, keywords, dateSelectFrom, dateSelectTo, userId, filterCategory}, {withCredentials: true});
            if(res.data.success){
                hideFilterDiary();
                setEntries(res.data.results);
            } else {
                setAlert({
                    showAlert: true,
                    alertType: 'danger',
                    alertMsg: res.data.message
                })
            }
        }catch(e) {
            setAlert({
                showAlert: true,
                alertType: 'danger',
                alertMsg: e.message
            })
        }
    }
    return (
    <div className='filterFormContainer'>
        <div className='filterForm'>
        {alert.showAlert && (<Alert type={alert.alertType} message={alert.alertMsg} />)}
            <form onSubmit={submitHandler} className='fform'> 
                <div className='filterFields filterGroups'>
                    <div className='filterCategoryContainer'>
                        <span style={{marginRight: "10px"}}>Find results that match</span>
                        <select name='filterCategory' onChange={defineFilterGroup} value={filterCategory}>
                            <option value='all'>All</option>
                            <option value='tc'>Title and Content Only</option>
                            <option value='date'>Date Only</option>
                        </select>
                    </div>
                    <div className='filterLabels'>Select Field</div>
                    <div className='FieldFilterOptionContainer filterOptionContainer'>
                        <div className='select'>
                            <select name='fieldSelect' disabled={filterCategoryController.titleContentOff} className='filterSelects fieldSelect' onChange={defineFieldSelection} value={fieldSelect}>
                                <option value='title'>Title</option>
                                <option value='content'>Content</option>
                                <option value='both'>Title and/or Content</option>
                            </select>
                        </div>
                        <div className='select'>
                            <select name='optionSelect' disabled={filterCategoryController.titleContentOff} className='filterSelects optionSelect' onChange={defineFieldScopeSelection} value={fieldScopeSelect}>
                                <option value='contains'>Contains</option>
                                <option value='exact'>Contains Exactly</option>
                            </select>
                        </div>
                        <input type='text' disabled={filterCategoryController.titleContentOff} placeholder='Key word' name='keyword' className='keyword' value={keywords} onChange={updateKeywords}></input>
                    </div>
                </div>
                <div className='filterDate filterGroups'>
                    <div className='filterLabels'>Select Date</div>
                    <div className='FieldFilterOptionContainer filterOptionContainer'>
                        <div className='dateSelectGroup'>
                            <span className='dateLabels'>From: </span>
                            <input type='date' disabled={filterCategoryController.dateOff} name='dateSelectFrom' className='filterSelects dateSelect' onChange={defineDateSelectFrom} value={dateSelectFrom}/>
                        </div>
                        <div className='dateSelectGroup'>
                            <span className='dateLabels'>To: </span>
                            <input type='date' disabled={filterCategoryController.dateOff} name='dateSelectTo' className='filterSelects dateSelect' onChange={defineDateSelectTo} value={dateSelectTo}/>
                        </div>
                    </div>
                    <div id='dateNote'>The range for Today is {`${currentMonth}/${currentDay}/${currentYear} - ${currentMonth}/${parseInt(currentDay)+1}/${currentYear}`}</div>
                </div>
                <div className='filterBtnGroup'>
                    <button type='submit' className='filterFormBtns' id='filterSubmit'>Submit</button>
                    <button className='filterFormBtns' id='filterCancel' onClick={() => {hideFilterDiary(false); setFilterMode(false)}}>Cancel</button>
                </div>
            </form>
        </div>
    </div>
    )
}

export default FilterForm
