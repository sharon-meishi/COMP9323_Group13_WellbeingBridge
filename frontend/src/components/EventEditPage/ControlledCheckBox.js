import React from 'react'
import { useForm, Controller } from 'react-hook-form';
import Checkbox from '@material-ui/core/Checkbox';

function ControlledCheckBox() {
    return (
        <>
        <Controller
        name='IsOnlineEvent'
        control={control}
        render={({ field }) => (
          <Checkbox
            color='primary'
            onChange={(e) => {
              field.onChange(e.target.checked);
            }}
            checked={field.value || false}
          />
        )}
      />
      <label>This is an online event</label>
      </>
    )
}

export default ControlledCheckBox
