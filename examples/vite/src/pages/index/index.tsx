import { useState } from 'react';
import { $page, Link } from 'react-router-decorator';
import reactLogo from '../../assets/react.svg';
import './index.css';
import viteLogo from '/vite.svg';

export function Index() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>
        <Link to={'/about'}>Click me.</Link>
      </h1>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React + `react-router-decorator`</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/pages/index/index.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  );
}

$page(Index, '*', 'react-router-decorator');
