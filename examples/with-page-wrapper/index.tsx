import { renderApp } from 'react-router-decorator';
import './pages/404';
import './pages/about';
import './pages/home';
import './pages/info';
import './pages/user';

renderApp(document.getElementById('app') as HTMLElement, { type: 'hash', withPageWrapper: true });
