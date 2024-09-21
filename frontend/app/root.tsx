import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import styles from './tailwind.css?url';
import { useChangeLanguage } from 'remix-i18next/react';
import { useTranslation } from 'react-i18next';
import i18next from '~/i18next.server';
export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];
import { Providers } from './providers';
import { LinksFunction } from '@remix-run/node';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { api } from '@/api/api';

export async function loader({ request }) {
  let locale = await i18next.getLocale(request);

  return json({
    locale,
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  });
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: 'common',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // Get the locale from the loader
  let { locale, BACKEND_URL } = useLoaderData<typeof loader>();

  let { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);
  return (
    <html lang="en" dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>
          {/* {children} */}
          <Outlet></Outlet>
          <ScrollRestoration />

          <Scripts
            dangerouslySetInnerHTML={{
              __html: `window.env = ${JSON.stringify(BACKEND_URL)}`,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

// export default function App() {
//   return <Outlet />;
// }
