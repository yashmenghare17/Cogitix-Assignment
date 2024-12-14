import React, { useEffect,useState } from "react";
import './style.css';
import axios from "axios";
const SideBar = () => {
    const [error, setError] = useState(false);
    const [state, setState] = useState('');
    const [listData,setListData] = useState([]);
    useEffect(()=>{
        setState('loading');
        axios
        .get('https://rickandmortyapi.com/api/episode')
        .then((res) => {
            console.log(res);
            setState('success');
            setListData(res.data.results);
        })
        .catch((err) => {
            console.error('Error:', err);
            setState('error');
            setError(err);
        });

    },[]);
    return(
        <div className="side-bar">
            <h2 style={{marginLeft:20}}><u>Episodes</u></h2>
            {listData && listData.length > 0 && listData.map(function(item,index){
                return (
                <div className="menu-item" key={index}>{item.name ? item.name :'N/A'}</div>
            );
            })}
        </div>
    );
}
export default SideBar;