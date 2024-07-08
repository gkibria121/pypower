//serv.dtt360.com:8000:Skhan:qGsg86afVQOnK-country-US-session-7Xx9B3Pb
export function parseProxyString(proxyString) {
    const [serverPart,port, username, password] = proxyString.split(':');
    
   
    
    return {
      server: `http://${serverPart}:${port}`,
      username,
      password
    };
  }