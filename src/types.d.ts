declare const game: GamePF2e
declare const canvas: CanvasPF2e
declare const ui: UiPF2e

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

type ModulePacket = ExploitVulnerabilityPacket
