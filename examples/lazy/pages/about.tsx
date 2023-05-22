import React from 'react';
import { Link } from 'react-router-decorator';

const About = () => {
  return (
    <h1>
      About{' '}
      <Link target={'_blank'} to={'https://www.npmjs.com/package/react-router-decorator'}>
        react-router-decorator
      </Link>
    </h1>
  );
};

export default About;
