import TitleBar from '../../components/TitleBar';
import { useContext, useEffect, useRef, useState } from 'react';
import { appContext } from '../../AppContext';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';

function Home() {
  const { logs } = useContext(appContext);
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const exportLogs = () => {
    if (logs) {
      setShowDownloadModal(false);
      const anchor = document.createElement('a');
      const url = (window as any).URL.createObjectURL(new Blob([logs], { type: 'plain/text' }));
      const dateString = new Date().toISOString();
      const timeString = new Date().toTimeString();
      const date = dateString.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)![0];
      const time = timeString.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g)![0];
      anchor.style.display = 'none';
      anchor.id = 'download';
      anchor.setAttribute('href', url);
      anchor.setAttribute('download', `minima_${date.split('-').join('_')}_${time.split('-').join('_')}.txt`);
      document.body.appendChild(anchor);
      document.getElementById('download')!.click();
      (window as any).URL.revokeObjectURL(url);
      anchor.remove();
    }
  };

  const displayDownloadModal = () => setShowDownloadModal(true);
  const hideDownloadModal = () => setShowDownloadModal(false);

  // keeps textarea scrolled to bottom
  useEffect(() => {
    if (textarea && textarea.current) {
      textarea.current!.scrollTop = textarea.current!.scrollHeight;
    }
  }, [logs, textarea]);

  return (
    <div className="app">
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
            <p className="mb-12">
              Lorem ipsum dolor sit amet consectetur. Eget dictumst sodales eget ipsum mauris enim malesuada tempus
              maecenas.
            </p>
            <Button variant="primary" onClick={exportLogs}>
              Download logs
            </Button>
          </div>
        </div>
      </Modal>
      <div className="h-screen flex flex-col flex-grow">
        <TitleBar />
        <div className="p-5 bg-core-black-contrast flex flex-col gap-6">
          <div>
            <div className="grid grid-cols-12">
              <div className="col-span-4">
                <h1 className="text-2xl">Logs</h1>
              </div>
              <div className="col-span-8 flex items-center justify-end mb-0.5">
                <div onClick={displayDownloadModal} className="cursor-pointer flex items-center justify-end gap-3">
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
              </div>
              <div className="col-span-12 mt-3">
                <p className="text-core-grey-100 text-sm">Logs are a record of your node's activity and processes.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 flex flex-grow text-sm w-full">
          <textarea
            readOnly
            ref={textarea}
            autoCorrect="none"
            value={logs || ''}
            className="font-mono leading-6 break-all textarea custom-scrollbar p-3 w-full h-full outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
