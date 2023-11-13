import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

// Styling
import { Lexend } from "@next/font/google";
import "~/styles/globals.css";

const lexend = Lexend({
  weight:'500',
  subsets: ['latin'],
  variable:'--font-lexend',
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};


export default api.withTRPC(MyApp);
