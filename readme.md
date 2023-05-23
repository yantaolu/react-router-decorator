![npm type definitions](https://img.shields.io/npm/types/react-router-decorator)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/yantaolu/react-router-decorator/react-router-dom)
![npm](https://img.shields.io/npm/v/react-router-decorator)
![NPM](https://img.shields.io/npm/l/react-router-decorator)
![npm](https://img.shields.io/npm/dw/react-router-decorator)
![GitHub last commit](https://img.shields.io/github/last-commit/yantaolu/react-router-decorator)

---

# react-router-decorator

Custom route with class decorator or function, automatic sorting and support nested routes. Based on `react-router-dom`.

基于 `react-router-dom` 封装，使用类装饰器或函数配置路由，自动排序，支持嵌套路由。

## Install

```
$ npm install --save react-router-decorator
```

or

```
$ yarn add react-router-decorator
```

or

```
$ pnpm add react-router-decorator
```

## Use `class decorator` ([TC39 Proposal](https://github.com/tc39/proposal-decorators))

### Config `tsconfig.json` to support `decorator`.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Config `Babel`(webpack) to support JavaScript/Typescript compiling.

```json
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "version": "2023-01" }],
    "@babel/plugin-proposal-class-properties"
  ]
}
```

or

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "version": "2023-01" }]
  ]
}
```

### Config `vite.config.ts` to support vite.

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy'],
        },
      },
    }),
  ],
});
```

## type.d.ts

```ts
import React from 'react';
import { NavigateFunction, RouteObject } from 'react-router-dom';

interface Extra {
  withPageWrapper?: boolean;
  childrenAsOutlet?: boolean;
}

type PickRouteObject = Pick<RouteObject, 'loader' | 'action'>;

type PageComponent = React.ComponentType<any> & Extra;

type Query = {
  readonly [key in string]: string | number | Array<string | number> | undefined;
};

type Params = {
  readonly [key in string]: string | undefined;
};

interface PageDefine {
  title?: string | ((params: Params, query: Query) => string);
  context?: string;
  lazy?: boolean;
}

interface WithWrappedProps {
  query: Query;
  params: Params;
  navigate: NavigateFunction;
  path: string;
  children?: React.ReactNode;
}

interface PageWrapperProps extends PageDefine {
  path: string;
  Component: PageComponent;
  childrenAsOutlet?: boolean;
}

type PageWrapperType = React.ComponentType<PageWrapperProps>;

type PageOptions = (PageDefine & PickRouteObject) | string;

interface RenderOptions {
  type?: 'hash' | 'history';
  Wrapper?: React.ComponentType<any>;
  withPageWrapper?: boolean;
  PageWrapper?: PageWrapperType;
  childrenAsOutlet?: boolean;
  debug?: boolean;
}
```

## API

### renderApp(element: HTMLElement, options?: RenderOptions)

instead of `ReactDOM.render(<App/>, element)`.

#### element

Type: `HTMLElement`, the `ReactDOM.render` root element.

#### options

Type: `RenderOptions`

### page(path: string | '/' | '*', options?: PageOptions)

use class decorator to register route.

#### path

Type: `string` , `"/"` or `"*"`

#### options

Type: `PageOptions`, if `typeof PageOptions` is `string` it's mean `document title`.

### $page(Component: PageComponent, path: string | '/' | '*', options?: PageOptions)

use function to register route.

#### Component

Type: `PageComponent`

#### path

Type: `string` , `"/"` or `"*"`

#### options

Type: `PageOptions`, if `typeof PageOptions` is `string` it's mean `document title`.

## Usage

### Use `page`, `$page`, `renderApp`

```tsx
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

### Custom render

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter, AppRoutes, MemoryRouter } from 'react-router-decorator';

// render AppRouter
createRoot(document.getElementById('app')).render(<AppRouter type={'hash'}/>);

// render AppRoutes
createRoot(document.getElementById('app')).render(<MemoryRouter>
  <AppRoutes/>
</MemoryRouter>);
```

### withPageWrapper

- PageWrapper

```tsx
const CustomPageWrapper: PageWrapperType = (props: PageWrapperProps) => {
  const { Component, ...others } = props;
  // do something
  return <Component/>
};
```

- `withPageWrapper: false`

```tsx
import React from 'react';
  
const Component = () => {
  const params = useParams();
  const id = params.id;
  return <>{id}</>
};
  
$page(Component, '/test/:id');
```

- `withPageWrapper: true`

```tsx
import React from 'react';
  
const Component = ({ params, query }) => {
  // 内置 PageWrapper 提供的能力
  const id = params.id;
  return <>{id}</>
};
  
$page(Component, '/test/:id');
```


### childrenAsOutlet (`{ children } instead of <Outlet/>`)

- `childrenAsOutlet: false`

```tsx
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

- `childrenAsOutlet: true`

```tsx
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

### [lazy](https://github.com/yantaolu/react-router-decorator/tree/main/examples/lazy) (since 0.2.0)

```tsx
import { lazy } from 'react';
import { $page, renderApp } from 'react-router-decorator';

const LazyComponent = lazy(() => import('./pages/lazy'));

$page(LazyComponent, '/lazy', { lazy: true });

renderApp(document.getElementById('app'));
```
