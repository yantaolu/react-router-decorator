import React from 'react';
import { Link, Outlet, page } from 'react-router-decorator';

@page('/user', { title: '用户' })
export class User extends React.Component {
  render() {
    return (
      <>
        <h1>用户主页</h1>
        <div>
          <Link to={`/user/info/test`}>User Info</Link>
        </div>
        {/* 嵌套路由插槽 */}
        <Outlet />
      </>
    );
  }
}
