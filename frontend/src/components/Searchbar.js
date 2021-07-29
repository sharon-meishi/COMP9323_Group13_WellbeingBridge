import React, { useState } from 'react';
import { Button, Select, Input } from 'semantic-ui-react';

const options = [
  { key: 'org', text: 'Organization', value: 'org' },
  { key: 'event', text: 'Event', value: 'event' },
];

function Searchbar({ defaultValue }) {
  const [select, setSelect] = useState(defaultValue);
  const [keyword, setKeyword] = useState('');

  const handleSubmit = () => {
    console.log(keyword, select);
  };

  return (
    <Input
      type='text'
      placeholder='Type keyword for...'
      onChange={(e) => setKeyword(e.target.value)}
      action
    >
      <input />
      <Select
        options={options}
        value={select}
        onChange={(e, { value }) => setSelect(value)}
      />
      <Button type='submit' onClick={handleSubmit}>
        Search
      </Button>
    </Input>
  );
}

export default Searchbar;
