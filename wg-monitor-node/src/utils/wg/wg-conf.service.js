/**
 * @file wg-conf.service.js
 * @description Configuración de Wireguard
 * Resumen de todo lo relacionado a Wireguard
 */

/**
 * Configuración de Nodos Cliente
 * 
 * # [Pendiente | TODO]:
 * - [x] Segmentar la generación de la configuración por Cliente, Repetidor, Router
 * - [ ] Verificar que realmente funciona ajsajsj
 */

async function getWgClientConfig(clientNode){
  const PreUp = ''
  const PreDown = ''

  const PostUp = ''
  
  const PostDown = ''
  let config = ""
  const persistenKeepAlive = 25 // 25 seg
  
  const gateway = clientNode.gateway

  config += `
  [Interface]
  PrivateKey = ${clientNode.privateKey}
  Address = ${clientNode.address}
  
  DNS = ${gateway.dns}
  MTU = ${gateway.mtu}

  [Peer]
  PublicKey = ${gateway.publicKey}
  PresharedKey = ${clientNode.presharedKey}
  AllowedIPs = ${gateway.allowedIPs}

  Endpoint = ${gateway.publicAddress}:${gateway.listenPort}
  PersistentKeepalive = ${persistenKeepAlive}
  `
  
  switch(clientNode.type) {
    case "CLIENT":
      config += `
      # Configuración de Cliente
      [Interface]
      PrivateKey = ${clientNode.privateKey}
      Address = ${clientNode.address}

      DNS = ${gateway.dns}
      MTU = ${gateway.mtu}

      [Peer]
      PublicKey = ${gateway.publicKey}
      PresharedKey = ${clientNode.presharedKey}
      AllowedIPs = ${gateway.allowedIPs} 

      Endpoint = ${gateway.publicAddress}:${gateway.listenPort}
      PersistentKeepalive = ${persistenKeepAlive}

      # Otras configuraciones
      `;
      break;
    
    case "REPEATER":
      PreUp = `
      sysctl -w net.ipv4.ip_forward=1; 
      `.split('\n').join(' ');
      PreDown = ` 
      sysctl -w net.ipv4.ip_forward=0; 
      `.split('\n').join(' ');

      PostUp = `
      iptables -t nat -A POSTROUTING -s ${serverNode.networkSegment} -o ${clientNode.outerInterfaceName} -j MASQUERADE;
      iptables -A FORWARD -i wg0 -j ACCEPT;
      iptables -A FORWARD -o wg0 -j ACCEPT;
      `.split('\n').join(' ');
      
      PostDown = `
      iptables -t nat -D POSTROUTING -s ${serverNode.networkSegment} -o ${clientNode.outerInterfaceName} -j MASQUERADE;
      iptables -D FORWARD -i wg0 -j ACCEPT;
      iptables -D FORWARD -o wg0 -j ACCEPT;
      `.split('\n').join(' ');
      
      config += `
      # Configuración de Repetidor
      [Interface]
      PrivateKey = ${clientNode.privateKey}
      Address = ${clientNode.address}

      DNS = ${gateway.dns}
      MTU = ${gateway.mtu}
      PreUp = ${PreUp}
      PostUp = ${PostUp} 
      PreDown = ${PreDown}
      PostDown = ${PostDown} 
      [Peer]
      PublicKey = ${gateway.publicKey}
      PresharedKey = ${clientNode.presharedKey}
      AllowedIPs = ${gateway.allowedIPs}  # Acceso a la red local y privada

      Endpoint = ${gateway.publicAddress}:${gateway.listenPort}
      PersistentKeepalive = ${persistenKeepAlive}

      # Otras configuraciones
      `;
      break;
    
    case "ROUTER":
      PreUp = `
      sysctl -w net.ipv4.ip_forward=1; 
      `.split('\n').join(' ');
      PreDown = ` 
      sysctl -w net.ipv4.ip_forward=0; 
      `.split('\n').join(' ');

      PostUp = `
      iptables -t nat -A POSTROUTING -s ${serverNode.networkSegment} -o ${clientNode.outerInterfaceName} -j MASQUERADE;
      iptables -t nat -A POSTROUTING -s ${clientNode.sharedNetwork} -o ${clientNode.interfaceName} -j MASQUERADE;
      iptables -A FORWARD -i  ${clientNode.interfaceName} -j ACCEPT;
      iptables -A FORWARD -o ${clientNode.interfaceName} -j ACCEPT;
      iptables -A FORWARD -i  ${clientNode.outerInterfaceName} -j ACCEPT;
      iptables -A FORWARD -o ${clientNode.outerInterfaceName} -j ACCEPT;
      `.split('\n').join(' ');
      
      PostDown = `
      iptables -t nat -D POSTROUTING -s ${serverNode.networkSegment} -o ${clientNode.outerInterfaceName} -j MASQUERADE;
      iptables -t nat -D POSTROUTING -s ${clientNode.sharedNetwork} -o ${clientNode.interfaceName} -j MASQUERADE;
      iptables -D FORWARD -i  ${clientNode.interfaceName} -j ACCEPT;
      iptables -D FORWARD -o ${clientNode.interfaceName} -j ACCEPT;
      iptables -D FORWARD -i  ${clientNode.outerInterfaceName} -j ACCEPT;
      iptables -D FORWARD -o ${clientNode.outerInterfaceName} -j ACCEPT;
      `.split('\n').join(' ');

    
      config += `
      # Configuración de Router
      [Interface]
      PrivateKey = ${clientNode.privateKey}
      Address = ${clientNode.address}
      
      DNS = ${gateway.dns}
      MTU = ${gateway.mtu}
      PreUp = ${PreUp}
      PostUp = ${PostUp} 
      PreDown = ${PreDown}
      PostDown = ${PostDown} 

      [Peer]
      PublicKey = ${gateway.publicKey}
      PresharedKey = ${clientNode.presharedKey}
      AllowedIPs = ${gateway.allowedIPs}  # Acceso a la red local y privada

      Endpoint = ${gateway.publicAddress}:${gateway.listenPort}
      PersistentKeepalive = ${persistenKeepAlive}

      # Otras configuraciones
      `;
      break;
  }

  return config;
}

/**
 * Configuración de Nodos Proveedor
 * 
 * # [Pendiente | TODO]:
 * - [X] Implementar IP Forwarding, Nateo y Route (PostUp, PostDown)
 * - [  ] Incluir en la configuración las conexiones a otros nodos servidores y su jerarquía
 * - [X] Modificar el esquema de los proveedores,
 * añadir listenPort, dns, mtu, allowedIPs, outerInterfaceName, networkSegment, access (PUBLIC|PRIVATE)
 * cambiar addressInterface por interfaceAddress
 */
async function getWgProviderConfig(serverNode){
  
  const clientNodes = serverNode.clientNodes
  
  let config = ""

  const PostUp = `
iptables -t nat -A POSTROUTING -s ${serverNode.networkSegment} -o ${serverNode.outerInterfaceName} -j MASQUERADE;
iptables -A INPUT -p udp -m udp --dport ${serverNode.listenPort} -j ACCEPT;
iptables -A FORWARD -i wg0 -j ACCEPT;
iptables -A FORWARD -o wg0 -j ACCEPT;
`.split('\n').join(' ');
  const PostDown = `
iptables -t nat -D POSTROUTING -s ${serverNode.networkSegment} -o ${serverNode.outerInterfaceName} -j MASQUERADE;
iptables -D INPUT -p udp -m udp --dport ${serverNode.listenPort} -j ACCEPT;
iptables -D FORWARD -i wg0 -j ACCEPT;
iptables -D FORWARD -o wg0 -j ACCEPT;
`.split('\n').join(' ');
  
  const StartConfig = []
  const EndConfig = []

  let clientsConfig = ""

  clientNodes.forEach(clientNode => {
    if(!clientNode.enabled)
      return

    clientsConfig += `
    # Client: ${clientNode.name}
    [Peer]
    PublicKey = ${clientNode.publicKey}
    PresharedKey = ${clientNode.presharedKey}
    AllowedIPs = ${clientNode.address}
    `

    if (clientNode.sharedNetwork) {
      const networks = clientNode.sharedNetwork.split(",");
      networks.forEach(network => {
        StartConfig.push(`ip route add ${network} via ${clientNode.address} dev ${serverNode.interfaceName}`);
        EndConfig.push(`ip route del ${network} via ${clientNode.address} dev ${serverNode.interfaceName}`);
    });
    }
  });



  config += `
  # Server: ${serverNode.name}
  [Interface]
  PrivateKey = ${serverNode.privateKey}
  Address = ${serverNode.addressInterface}
  ListenPort = ${serverNode.listenPort}
  PreUp = 
  PostUp = ${PostUp} ${StartConfig.map(c => `${c} ;`).join(" ")}
  PreDown =
  PostDown = ${PostDown} ${EndConfig.map(c => `${c} ;`).join(" ")}

  `
  config += clientsConfig
  return config
}

/**
 * Generar las llaves de un nodo
 * 
 * # [Pendiente | TODO]:
 * - [x] Implementar la generación de la clave privada (wg keygen)
 * - [x] Implementar la generación de la clave pública (echo <privatekey> | wg public)
 * - [x] Implementar la generación de la clave precompartida (wg genpsk) 
 */


async function WgGenerateKeys(){
  const {exec} = require('child_process') 

  const privateKey = await new Promise((resolve, reject) => {
    exec('wg genkey', (err, stdout, stderr) => {
      if(err)
        reject(err)
      resolve(stdout)
    })
  })

  const publicKey = await new Promise((resolve, reject) => {
    exec(`echo ${privateKey}  | wg genkey`, (err, stdout, stderr) => {
      if(err)
        reject(stderr)
      resolve(stdout.trim())
    })
  })

  const presharedKey = await new Promise((resolve, reject) => {
    exec('wg genpsk', (err, stdout, stderr) => {
      if(err)
        reject(stderr)
      resolve(stdout.trim())
    })
  })

  return {privateKey,publicKey, presharedKey}
  // const { publicKey, privateKey } = await wg.generateKeys()
  // return { publicKey, privateKey }
}

global.wg = {
  getWgClientConfig,
  getWgProviderConfig,
  WgGenerateKeys,
}