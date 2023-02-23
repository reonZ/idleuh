declare const game: GamePF2e
declare const canvas: CanvasPF2e
declare const ui: UiPF2e

interface ExploitVulnerabilityPacket extends SocketPacket {
    type: 'exploit-vulnerability'
    actorId: string
    targetId: string
    vulnerability: number
    success: number
}

interface CleanExploitVulnerabilityPacket extends SocketPacket {
    type: 'clean-exploit-vulnerability'
}

type ModulePacket = ExploitVulnerabilityPacket
