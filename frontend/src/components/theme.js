import { createMuiTheme} from '@material-ui/core/styles';
const theme = createMuiTheme({
 overrides: {
    MuiOutlinedInput: {
        multiline: {
            fontWeight: 'bold',
            fontSize: '20px',
            color: 'black',
            width: '50vw'
        }
    }
}
  
});
export default theme;