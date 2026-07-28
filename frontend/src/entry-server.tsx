import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './Context/AuthContext';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

interface RenderProps {
    path: string;
    helmetContext: any;
}

export function render({ path, helmetContext }: RenderProps) {
    const html = renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={path}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </StaticRouter>
        </HelmetProvider>
    );

    const { helmet } = helmetContext;

    return {
        html,
        head: {
            title: helmet.title.toString(),
            meta: helmet.meta.toString(),
            link: helmet.link.toString(),
        },
    };
}
