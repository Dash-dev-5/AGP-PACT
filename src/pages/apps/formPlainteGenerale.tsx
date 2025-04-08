import useAuth from 'hooks/useAuth';
import React from 'react';
import FormPlainteGeneraleAdmin from './formPlainteGeneraleAdmin';
import FormPlainteGeneraleComplainant from './formPlainteGeneraleComplainant';

const formPlainteGenerale = () => {
  const { user } = useAuth();
  console.log(user?.role);

  return (
    <React.Fragment>
      {user?.role === 'Administrator' && <FormPlainteGeneraleAdmin />}
      {user?.role === 'Complainant' && <FormPlainteGeneraleComplainant />}
    </React.Fragment>
  );
};

export default formPlainteGenerale;
