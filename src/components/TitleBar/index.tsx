import { useContext, useState } from 'react';
import { appContext } from '../../AppContext';

function TitleBar() {
  const { logs, emptyLogs } = useContext(appContext);
  const [showMenu, setShowMenu] = useState(false);

  const exportLogs = () => {
    setShowMenu(false);

    if (logs) {
      const anchor = document.createElement('a');
      const url = (window as any).URL.createObjectURL(new Blob([logs], {type: 'plain/text'}));
      const dateString = new Date().toISOString();
      const timeString = new Date().toTimeString();
      const date = dateString.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)![0];
      const time = timeString.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g)![0];
      anchor.style.display = 'none';
      anchor.id = 'download';
      anchor.setAttribute("href", url);
      anchor.setAttribute("download", `minima_${date.split('-').join('_')}_${time.split('-').join('_')}.txt`);
      document.body.appendChild(anchor);
      document.getElementById('download')!.click();
      (window as any).URL.revokeObjectURL(url);
      anchor.remove();
    }
  };

  return (
    <div className="sticky top-0 z-20 title-bar grid grid-cols-12">
      <div className="col-span-6">
        <div className=" text-white p-4">Logs</div>
      </div>
      <div className="col-span-6 relative flex items-center justify-end p-4">
        <svg
          className="cursor-pointer"
          onClick={() => setShowMenu((prevState) => !prevState)}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C11.4444 22 10.9724 21.7993 10.584 21.3979C10.1947 20.9975 10 20.5109 10 19.9381C10 19.3654 10.1947 18.8784 10.584 18.477C10.9724 18.0765 11.4444 17.8763 12 17.8763C12.5556 17.8763 13.0276 18.0765 13.416 18.477C13.8053 18.8784 14 19.3654 14 19.9381C14 20.5109 13.8053 20.9975 13.416 21.3979C13.0276 21.7993 12.5556 22 12 22ZM12 14.0619C11.4444 14.0619 10.9724 13.8612 10.584 13.4598C10.1947 13.0593 10 12.5727 10 12C10 11.4273 10.1947 10.9407 10.584 10.5402C10.9724 10.1388 11.4444 9.93814 12 9.93814C12.5556 9.93814 13.0276 10.1388 13.416 10.5402C13.8053 10.9407 14 11.4273 14 12C14 12.5727 13.8053 13.0593 13.416 13.4598C13.0276 13.8612 12.5556 14.0619 12 14.0619ZM12 6.12371C11.4444 6.12371 10.9724 5.92302 10.584 5.52165C10.1947 5.12119 10 4.63459 10 4.06186C10 3.48912 10.1947 3.00206 10.584 2.60069C10.9724 2.20023 11.4444 2 12 2C12.5556 2 13.0276 2.20023 13.416 2.60069C13.8053 3.00206 14 3.48912 14 4.06186C14 4.63459 13.8053 5.12119 13.416 5.52165C13.0276 5.92302 12.5556 6.12371 12 6.12371Z"
            fill="white"
          />
        </svg>
        <div className={`absolute top-12 z-30 transition-all origin-top-right ${showMenu ? 'scale-100' : 'scale-0'}`}>
          <div className="relative flex flex-col gap-4 pt-4 px-5 pb-4 text-core-grey-5 bg-grey shadow-xl min-w-[170px]">
            {!emptyLogs && <div className="cursor-pointer" onClick={exportLogs}>Export</div>}
            {emptyLogs &&  <div className="cursor-not-allowed opacity-60">Export</div>}
          </div>
        </div>
        {showMenu && (
          <div
            onClick={() => setShowMenu(false)}
            className="cursor-pointer fixed h-screen w-screen top-0 left-0 z-20"
          />
        )}
      </div>
    </div>
  );
}

export default TitleBar;
