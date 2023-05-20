import { renderApp } from 'react-router-decorator';
import './pages/about';
import './pages/home';
import './pages/info';
import './pages/user';

renderApp(document.getElementById('app') as HTMLElement, {
  type: 'history',
  withPageWrapper: false,
  childrenAsOutlet: true,
});
