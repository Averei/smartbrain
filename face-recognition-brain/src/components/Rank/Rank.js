import React from 'react';
const Rank = ({ name, entries }) => {
  console.log('Entries:', entries);  // Add a console log for debugging

  return (
    <div>
      <div className='white f3'>
        {`${name}, your current entry count is...`}
      </div>
      <div className='white f1'>
        {typeof entries === 'number' ? entries : '0'} {/* Safeguard for non-numeric or undefined entries */}
      </div>
    </div>
  );
};

export default Rank;
