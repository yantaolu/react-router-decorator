import React from 'react';
import { $page, Outlet, renderApp, WithWrappedProps } from 'react-router-decorator';
import './pages/404';
import './pages/about';
import './pages/home';
import './pages/info';
import './pages/user';

const App = (props: WithWrappedProps) => {
  return (
    <>
      <div>主路由</div>
      <Outlet />
      {props.children}
    </>
  );
};

$page(App, '/');

renderApp(document.getElementById('app') as HTMLElement, { type: 'hash', withPageWrapper: false, debug: true });
