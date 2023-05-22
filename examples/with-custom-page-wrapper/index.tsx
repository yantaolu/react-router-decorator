import React from 'react';
import { PageWrapper, PageWrapperProps, renderApp } from 'react-router-decorator';
import './pages/about';
import './pages/home';
import './pages/info';
import './pages/user';

const CustomPageWrapper: React.FC<PageWrapperProps> = (props) => {
  // todo something

  // 默认 PageWrapper 已经实现
  // 1、document.title 自动修改
  // 2、解析 RouteParams 可用页面组件的 props.params 里获取，等价函数组件中的 useParams()
  // 3、解析 URLSearchParams 可用页面组件的 props.query 里获取
  // 4、页面组件的 props.navigate 提供跳转，方便自定义事件跳转，等价函数组件中的 useNavigate()
  return <PageWrapper {...props} />;
};

renderApp(document.getElementById('app') as HTMLElement, {
  type: 'history',
  withPageWrapper: true,
  PageWrapper: CustomPageWrapper,
});
