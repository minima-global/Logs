import { useContext } from 'react';
import { appContext } from '../../AppContext';

function Line({ id, children }) {
  const { copied, setCopied } = useContext(appContext);

  const setActive = () => {
    const input = document.createElement('textarea');
    input.textContent = children;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    setCopied(id);
  };

  return (
    <div className={`mb-2 transition-all ${copied === id ? 'bg-white text-black' : ''}`} onContextMenu={setActive}>{children}</div>
  )
}

export default Line;
