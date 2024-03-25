import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Loading } from '@kubed/components';

export default function EdgewizeLayout() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  if (loading) {
    return <Loading className="page-loading" />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}
