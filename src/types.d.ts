interface ExploitVulnerabilityPacket extends SocketPacket {
    type: 'exploit-vulnerability'
    actorId: string
    targetId: string
    success: number
    vulnerability: number
    dc: number
    total: number
}

type Packet = ExploitVulnerabilityPacket
