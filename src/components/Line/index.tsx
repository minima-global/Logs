import { useContext } from 'react';
import { appContext } from '../../AppContext';

function Line({ id, children }) {
  const { copied, setCopied } = useContext(appContext);

  const setActive = () => {
    navigator.clipboard.writeText(children);
    setCopied(id);
  };

  return (
    <div className={`mb-2 transition-all ${copied === id ? 'bg-white text-black' : ''}`} onContextMenu={setActive}>{children}</div>
  )
}

export default Line;
