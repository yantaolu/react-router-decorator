import React from 'react';
import { Link, page } from 'react-router-decorator';

@page('/about', { title: '关于' })
export class About extends React.Component {
  render() {
    return (
      <>
        <h2>
          <Link to={'https://www.npmjs.com/package/react-router-decorator'}>react-router-decorator</Link>
        </h2>
        <h2>
          <Link to={'https://cn.vitejs.dev'}>Vite</Link>
        </h2>
        <h2>
          <Link to={'/'}>Home</Link>
        </h2>
      </>
    );
  }
}
