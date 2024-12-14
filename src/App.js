import React,{useState,useEffect} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [state, setState] = useState('');
  const [activeEpisode, setActiveEpisode] = useState('');
  const [products, setProducts] = useState([]);
  const [listData,setListData] = useState([]);
  const [countTitle,setCountTitle] = useState('');
  const [episodeName,setEpisodeName] = useState('');
    useEffect(()=>{
        setState('loading');
        axios
        .get('https://rickandmortyapi.com/api/episode')
        .then((res) => {
            console.log(res,'epo');
            setState('success');
            setListData(res.data.results);
        })
        .catch((err) => {
            console.error('Error:', err);
            setState('error');
            setError(err);
            setListData([]);
        });
      setState('loading');
      axios
      .get('https://rickandmortyapi.com//api/character')
      .then((res) => {
          console.log(res);
          setState('success');
          setProducts(res.data.results);
      })
      .catch((err) => {
          console.error('Error:', err);
          setState('error');
          setError(err);
          setProducts([]);
      });
    },[]);
  // event handler for page change on click
  const handlePageChange = (pageNumber) => {
    if (
      pageNumber > 0 &&
      pageNumber <= Math.ceil(products.length / 10) &&
      pageNumber !== page
    )
      setPage(pageNumber);    
  };
  const handleEpisodeSelect = (id,name) =>{
    setProducts([]);
    setActiveEpisode(id);
    setPage(1);
    setEpisodeName(name);
    setState('loading');
    axios
      .get(`https://rickandmortyapi.com/api/episode/${id}`)
      .then((res) => {
          // get All Characters for that episode
          if(res.data.characters && res.data.characters.length > 0 && res.data.characters.map((item)=>{
            axios
            .get(item)
            .then((response) => {
                setProducts(products=>[...products,response.data]);
            })
          }));
           setState('success');
      })
      .catch((err) => {
          console.error('Error:', err);
          setState('error');
          setError(err);
      });
      
  }
  useEffect(()=>{
    setCountTitle(`${products.length} Characters in episode ${episodeName}`);
  },[products]);
  const Loading = () =>{
    return(
      <div className='overlay'>
        <div className='loder'>
            Loading ....
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="container">
        <div className="side-bar">
              <h2 style={{marginLeft:20}}><u>Episodes</u></h2>
              {listData && listData.length > 0 && listData.map(function(item,index){
                  return (
                  <div className={`menu-item ${activeEpisode===item.id ? "active":""} `} key={index} onClick={()=>handleEpisodeSelect(item.id,item.name)}>{item.name ? item.name :'N/A'}</div>
              );
              })}
        </div>
        <div style={{marginLeft:30}}>
          {state=='loading' ? <Loading/> :''}
          <h1>Rick and Morty Characters</h1>
          <h4>{countTitle}</h4>
          {products.length && (
          <div className="All__products">
            {products.slice(page * 10 - 10, page * 10).map((product) => (
              <div key={product.id} className="product_card">
                <div><img src={product.image} alt={product.name} /></div>
                <p><b>{product.name ? product.name : 'N/A'}</b></p>
              </div>
            ))}
          </div>
        )}
        {products.length > 0 && (
          <section className="pagination">
            <span
              onClick={() => handlePageChange(page - 1)}
              className={`arrow ${page === 1 ? "pagination__disabled" : ""}`}
            >
              ⬅
            </span>
            {[...Array(Math.ceil(products.length / 10))].map((_, i) => (
              <span
                className={`page__number ${products.length} ${
                  page === i + 1 ? "selected__page__number" : ""
                }`}
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </span>
            ))}
            <span
              onClick={() => handlePageChange(page + 1)}
              className={`arrow ${
                page === Math.floor(products.length / 10)
                  ? "pagination__disabled"
                  : ""
              }`}
            >
              ➡
            </span>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}

export default App;
