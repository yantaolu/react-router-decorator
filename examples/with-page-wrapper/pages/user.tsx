import React from 'react';
import { Outlet, page } from 'react-router-decorator';

@page('/user', { title: '用户' })
export class User extends React.Component {
  render() {
    return (
      <>
        <div>用户</div>
        {/* 嵌套路由插槽 */}
        <Outlet />
      </>
    );
  }
}
