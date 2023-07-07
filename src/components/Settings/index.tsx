import { useTransition, animated } from '@react-spring/web';
import { modalAnimation } from '../../animations';
import { useContext } from 'react';
import { appContext } from '../../AppContext';

export function Settings({ display, close }) {
  const { shouldScrollToBottom, setShouldScrollToBottom, displaySize, setDisplaySize } = useContext(appContext);
  const transition: any = useTransition(display, modalAnimation as any);

  const scrollToBottom = () => {
    setShouldScrollToBottom(true);
  };

  const dontScrollToBottom = () => {
    setShouldScrollToBottom(false);
  };

  return (
    <div>
      {transition((style, display) => (
        <>
          {display && (
            <div className="mx-auto absolute top-0 left-0 z-20 w-full h-full z-10 flex items-center justify-center text-black">
              <div className="relative z-10 px-5 w-full max-w-lg">
                <animated.div style={style} className="bg-white rounded-lg p-6 mx-auto ">
                  <h1 className="text-2xl -mt-1 mb-4">Settings</h1>
                  <p>Scroll to bottom on every new message</p>
                  <div className="flex gap-4 mt-4">
                    <label>
                      <input
                        type="radio"
                        name="scroll"
                        value="Yes"
                        checked={shouldScrollToBottom}
                        onClick={scrollToBottom}
                      />
                      <span className="ml-4">Yes</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="scroll"
                        value="No"
                        checked={!shouldScrollToBottom}
                        onClick={dontScrollToBottom}
                      />
                      <span className="ml-4">No</span>
                    </label>
                  </div>
                  <p className="mt-4 mb-4">Text size</p>
                  <div className="flex gap-3">
                    <div
                      onClick={() => setDisplaySize('xs')}
                      className={`${
                        displaySize === 'xs' ? '' : 'opacity-30'
                      } text-xs cursor-pointer p-4 border-2 border-black flex items-center justify-center w-[50px] h-[50px]`}
                    >
                      A
                    </div>
                    <div
                      onClick={() => setDisplaySize('sm')}
                      className={`${
                        displaySize === 'sm' ? '' : 'opacity-30'
                      } text-sm cursor-pointer p-4 border-2 border-black flex items-center justify-center w-[50px] h-[50px]`}
                    >
                      A
                    </div>
                    <div
                      onClick={() => setDisplaySize(null)}
                      className={`${
                        displaySize === null ? '' : 'opacity-30'
                      } cursor-pointer p-4 border-2 border-black flex items-center justify-center w-[50px] h-[50px]`}
                    >
                      A
                    </div>
                    <div
                      onClick={() => setDisplaySize('lg')}
                      className={`${
                        displaySize === 'lg' ? '' : 'opacity-30'
                      } text-lg cursor-pointer p-4 border-2 border-black flex items-center justify-center w-[50px] h-[50px]`}
                    >
                      A
                    </div>
                  </div>
                  <div className="text-center mt-6">
                    <button
                      onClick={close}
                      type="button"
                      className="w-full px-4 py-3.5 rounded font-bold text-white bg-black"
                    >
                      Close
                    </button>
                  </div>
                </animated.div>
              </div>
              <div className="absolute bg-black bg-opacity-50 top-0 left-0 w-full h-full"></div>
            </div>
          )}
        </>
      ))}
    </div>
  );
}

export default Settings;
