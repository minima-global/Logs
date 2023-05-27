import * as React from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import { getLogs } from './lib';

export const appContext = createContext<{
  logs: string | null;
}>({ logs: null });

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const loaded = useRef(false);
  const [logs, setLogs] = useState<string | null>(null);

  // init mds
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;

      (window as any).MDS.init((evt: any) => {
        if (evt.event === 'inited' || evt.event === 'MINIMALOG') {
          getLogs().then((logs) => {
            setLogs(logs.map((i) => i.MESSAGE).join('\n'));
          })
        }
      });
    }
  }, [loaded]);

  const value = {
    logs,
  };

  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export default AppProvider;
