import { useState, useEffect } from 'react';

export function useFetch(url, query) {
  if ( !query ) { query = null; }
  const [data, setData] = useState();
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if ( query === null ) {
          setIsFetching(true);
          await fetch(url)
          .then(res => res.json())
          .then(data => {
            console.info(data);
            setData(data);
            setIsFetching(false);
          });
        } else {
          setIsFetching(true);
          await fetch(url + query)
          .then(res => res.json())
          .then(data => {
            console.info(data);
            setData(data);
            setIsFetching(false);
          });
        }
      } catch (error) {
        console.error(error);
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  return { 
    data: data, 
    isFetching: isFetching 
  };
}