import React from 'react';
import { $page, Outlet, WithWrappedProps, renderApp } from 'react-router-decorator';
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

$page(App, '/', '首页');

renderApp(document.getElementById('app') as HTMLElement, { type: 'hash', withPageWrapper: true, debug: true });
