import React from 'react';
import { $page, Link } from 'react-router-decorator';

export const About = () => {
  return (
    <h1>
      About{' '}
      <Link target={'_blank'} to={'https://www.npmjs.com/package/react-router-decorator'}>
        react-router-decorator 22
      </Link>
    </h1>
  );
};

$page(About, '/about', { title: '关于', context: '/' });
