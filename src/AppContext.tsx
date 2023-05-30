import * as React from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import { getLogs } from './lib';

export const appContext = createContext<{
  logs: string | null;
  emptyLogs: boolean;
}>({ logs: null, emptyLogs: true });

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const loaded = useRef(false);
  const [logs, setLogs] = useState<string | null>(null);
  const [emptyLogs, setEmptyLogs] = useState<boolean>(true);

  // init mds
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;

      (window as any).MDS.init((evt: any) => {
        if (evt.event === 'inited' || evt.event === 'MINIMALOG') {
          getLogs().then((logs) => {
            if (logs.length > 0) {
              setEmptyLogs(false);
            } else {
              setEmptyLogs(true);
            }

            setLogs(logs.map((i) => i.MESSAGE).join('\n'));
          });
        }
      });
    }
  }, [loaded]);

  const value = {
    logs,
    emptyLogs,
  };

  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export default AppProvider;
