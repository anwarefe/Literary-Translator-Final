
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-400"></div>
    </div>
  );
};

export default Loader;
