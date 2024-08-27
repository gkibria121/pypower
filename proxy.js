//pxoy.js

export function parseProxyString(proxyString) {
    const [serverPart,port, username, password] = proxyString.split(':');
    
   
    
    return {
      server: `http://${serverPart}:${port}`,
      username,
      password
    };
  }