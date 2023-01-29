interface ExploitVulnerabilityPacket extends SocketPacket {
    type: 'exploit-vulnerability'
    actorId: string
    targetId: string
    vulnerability: number
    weaknesses: string[]
    dc: number
    total: number
    die: number
}

type Packet = ExploitVulnerabilityPacket
