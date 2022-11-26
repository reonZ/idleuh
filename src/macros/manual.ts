import { IdleuhManualTokenApp } from '~src/apps/manual-token'

export async function manualToken(token: TokenPF2e) {
    if (!token || !token.isOwner) {
        ui.notifications.warn('You need to select an owned token.')
        return
    }
    new IdleuhManualTokenApp(token.document).render(true)
}
