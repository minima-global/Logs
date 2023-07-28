import { useContext, useEffect, useRef, useState } from 'react';
import { appContext } from '../../AppContext';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import { toHex } from '../../utilities/utilities';
import TitleBar from '../../components/UI/TitleBar';
import Line from '../../components/Line';
import Settings from '../../components/Settings';

function Home() {
  const { loaded, displaySize, logs, emptyLogs, shouldScrollToBottom, copied, hasScrolledToBottom, setHasScrolledToBottom } =
    useContext(appContext);
  const [scrollToTopDisabled, setScrollToTopDisabled] = useState(false);
  const [scrollToBottomDisabled, setScrollToBottomDisabled] = useState(false);
  const textarea = useRef<HTMLDivElement | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [hideTop, setHideTop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const exportLogs = () => {
    if (logs) {
      const dateString = new Date().toISOString();
      const timeString = new Date().toTimeString();
      const date = dateString.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)![0];
      const month = date.split('-')[1];
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const time = timeString.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g)![0];
      const actualMonth = monthNames[Number(month) - 1];
      const content = logs.map((i) => i.textContent).join('\n');

      const fileName = `minima_logs_${date.split('-')[2]}${actualMonth}${date.split('-')[0]}_${time
        .split(':')
        .join('')}.txt`;
      const blob = new Blob([content]);
      const url = (window as any).URL.createObjectURL(blob, { type: 'plain/text' });

      if (window.navigator.userAgent.includes('Minima Browser')) {
        // @ts-ignore
        Android.blobDownload(fileName, toHex(content));
        return setShowDownloadModal(false);
      }

      setShowDownloadModal(false);
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.id = 'download';
      anchor.setAttribute('href', url);
      anchor.setAttribute('download', fileName);
      document.body.appendChild(anchor);
      document.getElementById('download')!.click();
      (window as any).URL.revokeObjectURL(url);
      anchor.remove();
    }
  };

  const displayDownloadModal = () => setShowDownloadModal(true);
  const hideDownloadModal = () => setShowDownloadModal(false);

  // scrolls the text to bottom on first load
  useEffect(() => {
    if (loaded && !hasScrolledToBottom) {
      textarea.current!.scrollTop = textarea.current!.scrollHeight;
      setHasScrolledToBottom(true);
    }
  }, [logs, hasScrolledToBottom]);

  // scrolls the text to bottom if setting was toggled
  useEffect(() => {
    if (loaded && shouldScrollToBottom) {
      textarea.current!.scrollTop = textarea.current!.scrollHeight;
    }
  }, [logs, loaded, shouldScrollToBottom]);

  // shows hide the top section if the user is not scrolled at the bottom of the textarea
  // offset: 200 pixels
  useEffect(() => {
    if (textarea && textarea.current) {
      const offset = 200;

      const onScroll = () => {
        if (textarea.current!.scrollHeight > textarea.current!.scrollTop + textarea.current!.clientHeight + offset) {
          setHideTop(true);
        } else {
          setHideTop(false);
        }
      };

      textarea.current!.addEventListener('scroll', onScroll);

      return () => {
        textarea.current!.removeEventListener('scroll', onScroll);
      };
    }
  }, [logs, textarea]);

  const scrollToTop = () => {
    if (textarea.current) {
      textarea.current!.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (textarea.current) {
      textarea.current!.scrollTop = textarea.current!.scrollHeight;
    }
  };

  useEffect(() => {
    if (loaded && textarea.current) {
      const fn = () => {
        const offset = textarea.current!.clientHeight;
        setScrollToTopDisabled(textarea.current!.scrollTop < 10);
        setScrollToBottomDisabled(textarea.current!.scrollHeight <= textarea.current!.scrollTop + offset);
      };

      textarea.current!.addEventListener('scroll', fn);

      return () => {
        textarea.current!.removeEventListener('scroll', fn);
      };
    }
  }, [textarea, loaded]);

  return (
    <div className="app">
      <Settings display={showSettings} close={() => setShowSettings(false)} />
      <Modal
        display={showDownloadModal}
        frosted
        close={{
          textContent: 'Cancel',
          callback: hideDownloadModal,
        }}
      >
        <div className="text-center w-full">
          <div className="mx-auto text-center">
            <svg
              className="mx-auto mb-8"
              width="40"
              height="41"
              viewBox="0 0 40 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.82053 40.5C3.47351 40.5 2.33333 40.0333 1.4 39.1C0.466667 38.1666 0 37.0265 0 35.6794V28.5H3.99993V35.6794C3.99993 35.8846 4.0854 36.0727 4.25633 36.2436C4.42731 36.4146 4.61538 36.5 4.82053 36.5H35.1793C35.3845 36.5 35.5726 36.4146 35.7435 36.2436C35.9145 36.0727 35.9999 35.8846 35.9999 35.6794V28.5H39.9999V35.6794C39.9999 37.0265 39.5332 38.1666 38.5999 39.1C37.6665 40.0333 36.5264 40.5 35.1793 40.5H4.82053ZM19.9999 30.141L8.61547 18.7565L11.4257 15.8643L18 22.4386V0.0385742H21.9999V22.4386L28.5742 15.8643L31.3844 18.7565L19.9999 30.141Z"
                fill="#F4F4F5"
              />
            </svg>
            <p className="mb-12">This will download the logs as a text file</p>
            <Button variant="primary" onClick={exportLogs}>
              Download logs
            </Button>
          </div>
        </div>
      </Modal>
      <div className="h-full flex flex-col flex-grow bg-core-black-contrast" style={{ maxHeight: '100vh' }}>
        <TitleBar>
          {!emptyLogs && loaded && (
            <div onClick={displayDownloadModal} className="flex cursor-pointer items-center justify-end gap-3 -mt-1">
              Download
              <svg
                className="-mt-0.5"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.3077 16C1.80257 16 1.375 15.825 1.025 15.475C0.675 15.125 0.5 14.6974 0.5 14.1923V11.5H1.99997V14.1923C1.99997 14.2692 2.03202 14.3397 2.09612 14.4039C2.16024 14.468 2.23077 14.5 2.3077 14.5H13.6922C13.7692 14.5 13.8397 14.468 13.9038 14.4039C13.9679 14.3397 14 14.2692 14 14.1923V11.5H15.5V14.1923C15.5 14.6974 15.325 15.125 14.975 15.475C14.625 15.825 14.1974 16 13.6922 16H2.3077ZM7.99997 12.1154L3.7308 7.84619L4.78462 6.76162L7.25 9.22699V0.826965H8.74995V9.22699L11.2153 6.76162L12.2692 7.84619L7.99997 12.1154Z"
                  fill="#F4F4F5"
                />
              </svg>
            </div>
          )}
        </TitleBar>
        <div
          className={`flex flex-col gap-6 transition-all duration-150 ease-in-out max-w-xl w-full mx-auto ${
            !hideTop
              ? 'opacity-100 visible scaleY-1 h-fit pt-4 px-5 lg:px-0 pb-5 mb-1'
              : 'h-0 p-0 opacity-0 scaleY-0 -translate-y-24'
          }`}
        >
          <div>
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <p className="text-core-grey-100 text-sm">Logs are a record of your node's activity and processes.</p>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={textarea}
          className={`bg-core-black-100 flex flex-grow ${displaySize === 'sm' && 'text-sm'} ${displaySize === 'xs' && 'text-xs'} ${displaySize === 'lg' && 'text-lg'} w-full overflow-y-scroll custom-scrollbar ${
            hideTop ? 'px-2 pb-2' : 'p-2 lg:py-2 lg:px-5'
          }`}
        >
          <div className="max-w-xl lg:max-w-full w-full mx-auto">
            {!loaded && (
              <div className="flex w-full h-full justify-center items-center">
                <div className="text-center mb-12">
                  <div role="status" className="inline-block mx-auto mb-3">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div className="text-gray-400 relative">Loading, please wait</div>
                </div>
              </div>
            )}
            {loaded && logs && (
              <div
                className="p-3 lg:px-0 w-full outline-none overflow-hidden break-all"
                onContextMenu={(evt) => evt.preventDefault()}
              >
                {logs.map((log) => (
                  <Line id={log.id} key={log.id}>{log.textContent}</Line>
                ))}
              </div>
            )}
          </div>
        </div>
        {loaded && (
          <div className="absolute bottom-1 left-1 controls flex justify-end p-3">
            <button onClick={() => setShowSettings(true)} className="disabled:opacity-40">
              <img alt="Settings" src="./assets/settings.svg" />
            </button>
          </div>
        )}
        {loaded && (
          <div className="bottom-0 right-0 controls flex justify-end p-3">
            <button disabled={scrollToTopDisabled} onClick={scrollToTop} className="disabled:opacity-40">
              <img alt="Up" src="./assets/arrow_up.svg" />
            </button>
            <button disabled={scrollToBottomDisabled} onClick={scrollToBottom} className="disabled:opacity-40">
              <img alt="Down" src="./assets/arrow_down.svg" />
            </button>
          </div>
        )}
        {copied && (
          <div className="bg-status-green text-black absolute mx-auto flex items-center gap-2 rounded rounded-full px-5 py-2 bottom-0 left-0 right-0 w-fit mb-2 lg:mb-4">
            Copied
            <svg
              className="-mr-1.5"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                fill="#08090B"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
