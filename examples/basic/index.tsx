import { renderApp } from 'react-router-decorator';
import './pages/about';
import './pages/info';
import './pages/user';

renderApp(document.getElementById('app') as HTMLElement, { type: 'history', withPageWrapper: false });
