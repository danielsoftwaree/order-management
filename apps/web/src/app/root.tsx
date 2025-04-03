import { RootProviders } from './providers'
import { AppRouter } from './routes'

import '@mantine/core/styles.css'
import './styles/global.css'
import '@mantine/notifications/styles.css'

import { attachAuthInterceptor } from '@/shared/api/api.instance'
import { tokenStorage } from '@/shared/tokenStorage'

attachAuthInterceptor(tokenStorage.getToken)

function Root() {
    return (
        <RootProviders>
            <AppRouter />
        </RootProviders>
    )
}

export default Root
