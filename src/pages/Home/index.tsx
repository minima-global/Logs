import TitleBar from '../../components/TitleBar';
import { useContext, useEffect, useRef } from 'react';
import { appContext } from '../../AppContext';

function Home() {
  const { logs } = useContext(appContext);
  const textarea = useRef<HTMLTextAreaElement | null>(null);

  // keeps textarea scrolled to bottom
  useEffect(() => {
    if (textarea.current) {
      textarea.current.scrollTop = textarea.current.scrollHeight;
    }
  }, [logs, textarea]);

  return (
    <div className="app">
      <div className="h-screen flex flex-col flex-grow">
        <TitleBar />
        <div className="p-2 flex flex-grow text-sm">
          <textarea
            ref={textarea}
            value={logs || ''}
            readOnly
            className="textarea custom-scrollbar p-3 w-full h-full outline-none"
            autoCorrect="none"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
