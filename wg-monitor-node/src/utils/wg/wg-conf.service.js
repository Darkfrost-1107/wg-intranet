/**
 * @file wg-conf.service.js
 * @description Configuración de Wireguard
 * Resumen de todo lo relacionado a Wireguard
 */

/**
 * Configuración de Nodos Cliente
 * 
 * # [Pendiente | TODO]:
 * - [ ] Segmentar la generación de la configuración por Cliente, Repetidor, Router
 * - [ ] Verificar que realmente funciona ajsajsj
 */
async function getWgClientConfig(clientNode){
  
  let config = ""
  const persistenKeepAlive = 25
  
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

  return config
}

/**
 * Configuración de Nodos Proveedor
 * 
 * # [Pendiente | TODO]:
 * - [ ] Implementar IP Forwarding, Nateo y Route (PostUp, PostDown)
 * - [ ] Incluir en la configuración las conexiones a otros nodos servidores y su jerarquía
 * - [ ] Modificar el esquema de los proveedores,
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

    if(!clientNode.sharedNetwork)
      return

    const networks = clientNode.sharedNetwork.split(",")
    networks.forEach(network => {
      StartConfig.push(`ip route add ${network} via ${clientNode.address} dev ${gateway.interfaceName}`)
      EndConfig.push(`ip route del ${network} via ${clientNode.address} dev ${gateway.interfaceName}`)
    })
  })

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
 * - [ ] Implementar la generación de la clave privada (wg keygen)
 * - [ ] Implementar la generación de la clave pública (echo <privatekey> | wg public)
 * - [ ] Implementar la generación de la clave precompartida (wg genpsk) 
 */

async function WgGenerateKeys(){
  // const { publicKey, privateKey } = await wg.generateKeys()
  // return { publicKey, privateKey }
}

global.wg = {
  getWgClientConfig,
  getWgProviderConfig,
  WgGenerateKeys,
}