import React from 'react';
import { Link, Outlet } from 'react-router-decorator';

export default class User extends React.Component {
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
