import React, { useState } from 'react';
import { Form, Button, Select, Input } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

const options = [
  { key: 'org', text: 'Organization', value: 'organization' },
  { key: 'event', text: 'Event', value: 'event' },
];

function Searchbar({ defaultValue }) {
  const [select, setSelect] = useState(defaultValue);
  const [keyword, setKeyword] = useState('');
  const history = useHistory();

  const toSearchPage = () => {
    const data = { keyword: keyword };
    const queryPath = new URLSearchParams(data).toString();
    const path = {
      pathname: `/${select}/search`,
      search: `?${queryPath}`,
    };
    history.push(path);
  };

  return (
    <Form onSubmit={toSearchPage} style={{ fontSize: '15px' }}>
      <Form.Field>
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
          <Button type='submit' color='teal'>Search</Button>
        </Input>
      </Form.Field>
    </Form>
  );
}

export default Searchbar;
