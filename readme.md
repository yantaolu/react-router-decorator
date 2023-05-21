> 基于 react-router-dom 封装的路由工具，提供装饰器/函数模式设置路由，自动排序，支持嵌套路由

---

<h4 style='color: #bd1515'> 类`decorator` 使用前需开启装饰器的相关配置，以 `TypeScript` 和 `Babel` 为例，部分参考如下</h4>

- TypeScript 配置 tsconfig.json

    ```json
    {
      "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
      }
    }
    ```

- Babel 配置 [参照decorators插件](https://babeljs.io/docs/babel-plugin-proposal-decorators)，可结合 `webpack` 使用

    ```json
    {
      "plugins": [
        ["@babel/plugin-proposal-decorators", { "version": "2023-01" }],
        "@babel/plugin-proposal-class-properties"
      ]
    }
    ```

    ```json
    {
      "presets": ["@babel/preset-env"],
      "plugins": [
        ["@babel/plugin-proposal-decorators", { "version": "2023-01" }]
      ]
    }
    ```

<h4 style='color: #bd1515'> !! 装饰器只是语法，并不能自动导入文件，仍需手动导入，webpack 自动导入的插件在开发中</h4>

---

<h4> <a href="https://github.com/yantaolu/react-router-decorator/tree/main/examples">代码示例</a></h4>

```typescript jsx
import React from 'react';
import { page, $page, Outlet, NavLink, renderApp } from 'react-router-decorator';

// 主路由
@page('/')
class PageIndex extends React.Component {
  render () {
    return <div>首页</div>
  }
}

// 父路由
@page('/user', { title: '用户页面' })
class PageUser extends React.Component {
  render () {
    return <>
      <div>User</div>
      <Outlet/>
    </>
  }
}
// 嵌套路由指定 context 
@page('/:id', { title: '用户详情', context: '/user' })
class PageUserInfo extends React.Component {
  render () {
    return <div>user info</div>
  }
}

// 同一个组件多个路由（类似有权限控制的场景）
@page('/normal/management', { title: '普通' })
@page('/management', { title: '高级' })
class PageManagement extends React.Component {
  render () {
    return <div>Management</div>
  }
}

// 404路由
@page('*', { title: '404页面' })
class Page404 extends React.Component {
  render () {
    return <div
      <div>404</div>
      <NavLink to='/'>返回首页</NavLink>
    </div>
  }
}

const FuncComponent = () => {
  return <div>函数组件</div>
};

// 注册函数组件
$page(FuncComponent, '/fun1');
$page(FuncComponent, '/fun2');

// 入口等价于 ReactDOM.render
renderApp(document.getElementById('app'));
```

---

- ReactDOM.render 的各种替代方式

    ```typescript jsx
    import React from 'react';
    import { Root, createRoot } from 'react-dom/client';
    import { AppRouter, AppRoutes, MemoryRouter, renderApp } from 'react-router-decorator';
    
    type RenderOptions = {
      // 默认使用 HashRouter 或 BrowserRouter
      type?: 'hash' | 'history';
      // 在 Router 外层的包裹，例如使用 antd ConfigProvider 或者 Context 之类
      Wrapper?: React.ComponentClass | React.FC;
      // 页面组件使用默认 PageWrapper 处理简单事项，如修改 document.title 或者解析 params/query 等
      withPageWrapper?: boolean;
      // 使用自定义的 PageWrapper
      CustomPageWrapper?: CustomPageWrapper;
      // 嵌套路由中使用 {children} 代替 <Outlet/>
      childrenAsOutlet?: boolean;
      // console一些关于路由的调试信息
      debug?: boolean;
    };
    
    // 方式一：renderApp
    renderApp(document.getElementById('app'), {});
    
    // 方式二：AppRouter
    createRoot(document.getElementById('app')).render(<AppRouter/>);
    
    // 方式三：AppRoutes
    createRoot(document.getElementById('app')).render(<MemoryRouter>
      <AppRoutes/>
    </MemoryRouter>);
    ```


- withPageWrapper (使用 PageWrapper 包裹页面)

  - 自定义 PageWrapper

  ```typescript jsx
  type CustomPageWrapperProps = {
    path: string;
    Component: ReactComponent;
    title?: string;
    [p: string]: any;
  };

  type CustomPageWrapper = FC<CustomPageWrapperProps> | ComponentClass<CustomPageWrapperProps, any>;
  ```

  - 使用前

  ```typescript jsx
  import React from 'react';
    
  const Component = () => {
    const params = useParams();
    const id = params.id;
    return <>{id}</>
  };
    
  $page(Component, '/test/:id');
  ```

  - 内置 PageWrapper 自动解析路由参数及query参数，使用后

  ```typescript jsx
  import React from 'react';
    
  const Component = ({ params, query }) => {
    const id = params.id;
    return <>{id}</>
  };
    
  $page(Component, '/test/:id');
  ```


- childrenAsOutlet (嵌套路由中使用 `{ children }` 代替 `<Outlet/>`)

  - 使用前

  ```typescript jsx
  @page('/user', { title: '用户页面' })
  class PageUser extends React.Component {
    render () {
      return <>
        <div>User</div>
        <Outlet/>
      </>
    }
  }
  // 嵌套路由指定 context 
  @page('/:id', { title: '用户详情', context: '/user' })
  class PageUserInfo extends React.Component {
    render () {
      return <div>user info</div>
    }
  }
  ```

  - 使用后

  ```typescript jsx
  @page('/user', { title: '用户页面' })
  class PageUser extends React.Component {
    render () {
      return <>
        <div>User</div>
        {this.props.children}
      </>
    }
  }

  // 嵌套路由指定 context 
  @page('/:id', { title: '用户详情', context: '/user' })
  class PageUserInfo extends React.Component {
    render () {
      return <div>user info</div>
    }
  }
  ```
