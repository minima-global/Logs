import { useTransition, animated } from '@react-spring/web';
import { modalAnimation } from '../../animations';

export function ConfirmModal({ display, message, close }) {
  const transition: any = useTransition(display, modalAnimation as any);

  return (
    <div>
      {transition((style, display) => (
        <>
          {display && (
            <div className="mx-auto absolute top-0 left-0 z-20 w-full h-full z-10 flex items-center justify-center text-black">
              <div className="relative z-10 px-5">
                <animated.div style={style} className="bg-white rounded-lg p-6 mx-auto max-w-lg">
                  <div className="text-center">
                    <h1 className="font-bold text-xl mb-7 mx-10">{message}</h1>
                    <button
                      onClick={close}
                      type="button"
                      className="w-full px-4 py-3.5 rounded font-bold text-white bg-black"
                    >
                      Confirm
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

export default ConfirmModal;
