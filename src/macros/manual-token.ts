import { ManualToken } from '@apps/manual-token'

export async function manualToken(token: TokenPF2e) {
    if (!token || !token.isOwner) {
        ui.notifications.warn('You need to select an owned token.')
        return
    }
    new ManualToken(token.document).render(true)
}
