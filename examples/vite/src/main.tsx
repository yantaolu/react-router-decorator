import { renderApp } from 'react-router-decorator';
import './global.css';
import './pages/about';
import './pages/index';

renderApp(document.getElementById('root') as HTMLElement, { type: 'history' });
