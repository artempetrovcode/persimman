// @flow
import * as React from 'react';

const {useState, useEffect} = React;

function useIsOnline() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  useEffect(() => {
    function handleConnectionChange(event) {
      if (navigator.onLine) {
        console.log("You are now connected to the network.", event);
      } else {
        console.log("The network connection has been lost.", event);
      }
      setIsOnline(navigator.onLine);
    }
    
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return function cleanup() {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    }
  }, []);

  return isOnline;
}

export default useIsOnline;