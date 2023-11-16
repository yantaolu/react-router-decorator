import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  HashRouter,
  Link,
  Outlet,
  RouteObject,
  useLocation,
  useNavigate,
  useParams,
  useRoutes,
} from 'react-router-dom';
import type {
  PageComponent,
  PageOptions,
  PageWrapperProps,
  PageWrapperType,
  Query,
  RenderOptions,
  RouteOption,
  WithWrappedProps,
} from './types';

export * from 'react-router-dom';
export type { PageWrapperProps, PageWrapperType, WithWrappedProps };

/**
 * 记录路由
 */
const _routeMap: Record<string, RouteOption> = {};

/**
 * 地址栏中的 search 转换为 query 对象
 * @param search {string}
 */
export const transSearch2Query = (search = ''): Query => {
  const qs = search?.replace(/^\?+/, '') ?? '';

  if (!qs.length) return {};

  return (
    qs.split('&').reduce((prev: Record<string, Query[keyof Query]>, current) => {
      try {
        const [key, value] = current.split('=').map(decodeURIComponent);
        // Automatic parsing number
        const val = /^[1-9]\d*$/.test(value) && value <= `${Number.MAX_SAFE_INTEGER}` ? Number(value) : value;
        // Array
        if (key in prev) {
          if (!Array.isArray(prev[key])) {
            prev[key] = [prev[key] as string | number];
          }
          (prev[key] as Array<string | number>).push(val);
        } else {
          prev[key] = val;
        }
      } catch (e) {
        console.error(e);
      }
      return prev;
    }, {}) ?? {}
  );
};

/**
 * 路由辅助工具，可渲染所有路由，方便开发人员切换页面
 *
 * @param props
 * @constructor
 */
export const DevRouterHelper: React.FC<{ label?: string }> = (props) => {
  const { label = '快捷路由 (仅开发模式使用，鼠标移出消失、悬停上边界显示) :' } = props;
  const [visible, setVisible] = React.useState<boolean>(true);

  const timeoutRef = React.useRef<any>();

  const show = React.useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, 500);
  }, []);

  const hide = React.useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  React.useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(hide, 10000);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const routers = React.useMemo(
    () =>
      Object.entries(getRouteConfig()).map(([path, config]) => (
        <Link
          key={path}
          to={path === '/*' ? '__**__' : path}
          style={{ marginRight: 12, fontSize: 12, color: '#428df5' }}
        >
          {typeof config.title === 'function' ? config.title({}, {}) : config.title}
        </Link>
      )),
    [],
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        minHeight: 20,
        zIndex: 99999999,
      }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <style></style>
      <div
        style={{
          padding: '6px 12px',
          background: '#dfdfdf',
          display: 'flex',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          alignItems: 'center',
          fontSize: 12,
          lineHeight: '20px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <span style={{ color: 'red', marginRight: 12, userSelect: 'none' }}>{label}</span>
        {routers}
      </div>
    </div>
  );
};

/**
 * 默认页面 Wrapper 附加自动解析 params、query 追加 navigate
 * @param props
 * @constructor
 */
export const PageWrapper: PageWrapperType = (props: PageWrapperProps) => {
  const { Component, title, childrenAsOutlet, context = '', path, lazy } = props;
  const { pathname, search } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const query = React.useMemo(() => transSearch2Query(search), [search]);
  const fullPath = resolveAbsolutePath(context, path);

  React.useEffect(() => {
    const originalTitle = document.title;

    if (title) {
      const regExp = new RegExp(`^${fullPath.replace(/(\/:[^?/]+)/gi, '(\\/[^?/]+)')}$`, 'i');
      // 路由和当前的路径匹配时
      regExp.test(pathname.replace(/\/$/, '')) &&
        (document.title = typeof title === 'function' ? title(params, query) : title);
    }

    return () => {
      document.title = originalTitle;
    };
  }, [title, pathname, search]);

  const Wrapper = lazy ? React.Suspense : React.Fragment;

  return (
    <Wrapper>
      <Component path={fullPath} params={params} query={query} navigate={navigate}>
        {!!childrenAsOutlet && <Outlet />}
      </Component>
    </Wrapper>
  );
};

/**
 * 路由路径统一转换为绝对路径
 * @param paths
 */
const resolveAbsolutePath = (...paths: string[]) =>
  [
    '/',
    paths
      .filter((path) => Boolean(path?.trim()))
      .map((path) => path.trim())
      .join('/')
      .replace(/\/+$/, ''),
  ]
    .join('/')
    .replace(/\/+/g, '/');

/**
 * 路由路径正则
 */
const routeRegExp = /^(\/?((:?[\w-]+\??)|(\*)))+$/i;

const legalRouteRules = `/
test
/test
/:id
/:id?
/:name/:id
/:name/:id?
/:name?/:id?
/test/*
/:name/*
/:name?/*
/*
*`
  .split('\n')
  .map((str) => str.trim());

// legalRouteRules.map((str) => console[routeRegExp.test(str) ? 'log' : 'error'](str));

/**
 * 类装饰器，用于注册类组件路由
 * @param path 路由路径
 * @param options 附加参数
 */
export const page = (path: string | '/' | '*', options?: PageOptions) => {
  const { context = '', ...others } = typeof options === 'string' ? { title: options } : options ?? {};

  // 嵌套路由上下文不合法
  if (context.trim() && !context.startsWith('/')) {
    throw new Error('嵌套路由上下文不合法，请使用 "/" 开始的绝对路径，多级嵌套使用完整上下文');
  }

  const absolutePath = resolveAbsolutePath(path);

  if (absolutePath !== '/' && !routeRegExp.test(path)) {
    throw new Error(`路由路径不合法，支持的路由路径如: ${legalRouteRules.map((p) => `"${p}"`)}`);
  }

  return (Component: PageComponent): void => {
    _routeMap[resolveAbsolutePath(context, path)] = {
      ...others,
      path: absolutePath,
      Component,
      context,
    };
  };
};

/**
 * 函数注册路由，类组件和函数组件均可使用
 * @param Component
 * @param path
 * @param options
 */
export const $page = (Component: PageComponent, path: string | '/' | '*', options?: PageOptions): void => {
  return page(path, options)(Component);
};

/**
 * 将路由配置转换为目标对象
 * @param config
 * @param options
 */
const transRoute = (
  config: RouteOption,
  options: Pick<RenderOptions, 'PageWrapper' | 'withPageWrapper' | 'childrenAsOutlet'>,
): RouteObject => {
  const { path, Component, title, context, lazy, ...routeObject } = config;
  const _withPageWrapper = Component.withPageWrapper ?? options.withPageWrapper;
  const _childrenAsOutlet = Component.childrenAsOutlet ?? options.childrenAsOutlet;
  const _PageWrapper: PageWrapperType = options.PageWrapper ?? PageWrapper;

  const Wrapper = lazy ? React.Suspense : React.Fragment;

  return {
    ...routeObject,
    path,
    element: _withPageWrapper ? (
      <_PageWrapper
        context={context}
        path={path}
        Component={Component}
        title={title}
        childrenAsOutlet={_childrenAsOutlet}
        lazy={lazy}
      />
    ) : (
      <Wrapper>
        <Component>{_childrenAsOutlet && <Outlet />}</Component>
      </Wrapper>
    ),
  };
};

/**
 * 路由路径排序算法
 * @param a
 * @param b
 */
export const routeSorter = (a: string, b: string) => {
  const aArr = a.split('/');
  const bArr = b.split('/');
  const len = Math.max(aArr.length, bArr.length);
  for (let i = 0; i < len; i++) {
    if (aArr[i] && !bArr[i]) return 1;
    if (!aArr[i] && bArr[i]) return -1;
    if (aArr[i] === bArr[i]) {
      continue;
    }
    // *优先级最低
    if (aArr[i] === '*') return 1;
    if (bArr[i] === '*') return -1;
    return aArr[i] > bArr[i] ? 1 : -1;
  }
  return a > b ? 1 : -1;
};

/**
 * useRoutes
 * @param props
 * @constructor
 */
export const AppRoutes = (props: Omit<RenderOptions, 'type' | 'Wrapper'>): React.ReactElement | null => {
  const { withPageWrapper = true, PageWrapper, childrenAsOutlet = false, debug = false } = props;
  const _routes = React.useMemo(() => {
    const _routes: Array<RouteObject> = [];
    const { ['/']: _index, ...pages } = _routeMap;

    const deepContextRoute = (ctx: string, routes: Array<RouteObject>, p?: string): RouteObject | undefined => {
      const len = routes.length;
      let route;
      for (let i = len - 1; i >= 0; i--) {
        const { path, children } = routes[i];
        const absolutePath = resolveAbsolutePath(p ?? '', path as string);
        if (!ctx.startsWith(absolutePath)) {
          continue;
        }
        if (absolutePath === ctx) {
          route = routes[i];
        }
        if (!route && children) {
          route = deepContextRoute(ctx, children, absolutePath);
        }
        if (route) {
          break;
        }
      }
      return route;
    };

    const getContextRoute = (ctx: string): RouteObject | undefined => {
      const _ctx = _routes.find((r) => r.path === ctx);
      if (!_ctx) {
        return deepContextRoute(ctx, _routes);
      }
      return _ctx;
    };

    const transOption = { withPageWrapper, childrenAsOutlet, PageWrapper };

    _index && _routes.push(transRoute(_index, transOption));

    Object.keys(pages)
      .sort(routeSorter)
      .forEach((p) => {
        const option = pages[p];
        const { path, context, ...config } = option;
        // 有上下文则是嵌套路由
        if (context) {
          const parent = getContextRoute(context);
          if (parent && !parent.children) {
            parent.children = [transRoute({ path: path.substring(1), context, ...config }, transOption)];
          } else if (parent?.children) {
            parent.children.push(transRoute({ path: path.substring(1), context, ...config }, transOption));
          } else {
            console.error('未找到匹配的嵌套上下文');
          }
        } else {
          _routes.push(transRoute(option, transOption));
        }
      });

    if (debug) {
      console.warn('[Debug] 路由路径', Object.keys(_routeMap));
      console.warn('[Debug] 路由配置如下:');
      console.warn(_routes);
    }
    return _routes;
  }, [Object.keys(_routeMap).join(';')]);

  return useRoutes(_routes);
};

/**
 * Router with Routes
 * @param props
 * @constructor
 */
export const AppRouter = (props: RenderOptions) => {
  const { type, Wrapper = React.Fragment, helper, ...others } = props;
  const Router = type === 'history' ? BrowserRouter : HashRouter;
  return (
    <Wrapper>
      <Router>
        {(helper ?? props.debug) && <DevRouterHelper />}
        <AppRoutes {...others} />
      </Router>
    </Wrapper>
  );
};

/**
 * 获取所有的路由绝对路径及相关配置
 */
export const getRouteConfig = (): Record<string, RouteOption> =>
  Object.keys(_routeMap).reduce((prev, current) => {
    prev[current] = { ..._routeMap[current] };
    return prev;
  }, {} as Record<string, RouteOption>);

/**
 * ReactDOM.render
 * @param element
 * @param options
 */
export const renderApp = (element: HTMLElement, options?: RenderOptions) => {
  ReactDOM.render(<AppRouter {...options} />, element);
};
