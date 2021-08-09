import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiOutlinedInput: {
      multiline: {
        color: 'black',
        width: '100%',
      },
    },
  },
});
export default theme;
