import * as React from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import { getLogs } from './lib';

export const appContext = createContext<{
  logs: { id: number; textContent: string }[] | null;
  emptyLogs: boolean;
  copied: number | null;
  setCopied: React.Dispatch<React.SetStateAction<number | null>>;
  loaded: boolean;
}>({ logs: null, emptyLogs: true, loaded: false, copied: null, setCopied: () => null });

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const loaded = useRef(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [logs, setLogs] = useState<{ id: number; textContent: string }[] | null>(null);
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

            setLogs(
              logs.map((i) => {
                const decoded = decodeURIComponent(i.MESSAGE).replace('%27', "'");
                return { textContent: decoded, id: i.ID };
              })
            );
          });
        }
      });
    }
  }, [loaded]);

  // reset selected after 1 second
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(null);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  const value = {
    logs,
    emptyLogs,
    copied,
    setCopied,
    loaded: loaded.current,
  };

  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export default AppProvider;
