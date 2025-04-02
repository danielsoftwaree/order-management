import { RootProviders } from './providers'
import { AppRouter } from './routes'

import '@mantine/core/styles.css'
import './styles/global.css'

function Root() {
    return (
        <RootProviders>
            <AppRouter />
        </RootProviders>
    )
}

export default Root
