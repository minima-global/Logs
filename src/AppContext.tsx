import * as React from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import { get, getLogs } from './lib';

export const appContext = createContext<{
  logs: { id: number; textContent: string }[] | null;
  emptyLogs: boolean;
  copied: number | null;
  setCopied: React.Dispatch<React.SetStateAction<number | null>>;
  hasScrolledToBottom: boolean;
  setHasScrolledToBottom: React.Dispatch<React.SetStateAction<boolean>>;
  loaded: boolean;
  shouldScrollToBottom: boolean;
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
  displaySize: string | null;
  setDisplaySize: React.Dispatch<React.SetStateAction<null | string>>;
}>({
  logs: null,
  emptyLogs: true,
  loaded: false,
  copied: null,
  setCopied: () => null,
  hasScrolledToBottom: false,
  setHasScrolledToBottom: () => null,
  shouldScrollToBottom: false,
  setShouldScrollToBottom: () => null,
  displaySize: null,
  setDisplaySize: () => null,
});

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const loaded = useRef(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [logs, setLogs] = useState<{ id: number; textContent: string }[] | null>(null);
  const [emptyLogs, setEmptyLogs] = useState<boolean>(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [displaySize, setDisplaySize] = useState<string | null>(null);

  // init mds
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;

      (window as any).MDS.init((evt: any) => {
        if (evt.event === 'inited') {
          get('DISPLAY_SIZE').then((response) => {
            if (response !== '0') {
              setDisplaySize(response as string);
            }
          });

          get('SCROLL_TO_BOTTOM').then((response) => {
            if (response !== '0') {
              setShouldScrollToBottom(true);
            }
          });
        }

        if (evt.event === 'inited' || evt.event === 'MINIMALOG') {
          getLogs().then((logs) => {
            if (logs.length > 0) {
              setEmptyLogs(false);
            } else {
              setEmptyLogs(true);
            }

            setLogs(
              logs
                .map((i) => {
                  try {
                    const decoded = decodeURIComponent(i.MESSAGE).replace('%27', "'");
                    return { textContent: decoded, id: i.ID };
                  } catch {
                    try {
                      const decoded = decodeURIComponent(i.MESSAGE.replace(/%...$/, '...')).replace('%27', "'");
                      return { textContent: decoded, id: i.ID };
                    } catch {
                      return false;
                    }
                  }
                })
                .filter(Boolean) as { id: number; textContent: string }[]
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
    hasScrolledToBottom,
    setHasScrolledToBottom,
    loaded: loaded.current,
    shouldScrollToBottom,
    setShouldScrollToBottom,
    displaySize,
    setDisplaySize,
  };

  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export default AppProvider;
