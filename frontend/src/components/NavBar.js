import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import icon from '../Assets/WellbeingBridgeLogo.png';
import {FormControl, MenuItem, Select, InputBase} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1
    },
    title: {
        height: '40px',
        backgroundColor: '#C5EDE9',
        paddingTop: '15px',
        fontFamily: 'Noto Sans',
        fontSize: '20px',
        fontWeight: 400,
        textDecoration: 'underline',
        textAlign: 'center'
    },
    image: {
        width: '200px',
        height: '40px',
        backgroundImage: `url(${icon})`,
        backgroundRepeat: "no-repeat"
    },
    border: {
        height: '60px',
        borderBottom: 'solid rgba(0, 0, 0, 0.18)',
        display: 'flex',
        flexDirection: 'row',
        paddingTop: '20px',
        justifyContent: 'space-between'
    },
    leftBox: {
        display: 'flex',
        flexDirection: 'row'
    },
    searchBox: {
        border: 'solid #E5E5E5',
        width: '400px',
        height: '32px',
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '10px'
    },
    select: {
        width: '150px'
    },
    input: {
        borderLeft: 'solid rgba(0, 0, 0, 0.18)',
        width: '400px'
    },
    search: {
        marginTop: '5px'
    },
    button: {
        width: '80px',
        height: '40px',
        backgroundColor: '#216991',
        borderRadius: '5px',
        color: 'white',
        textAlign: 'center',
        lineHeight: '40px',
        marginRight: '50px'
    }
}));

export default function NavBar() {
    const classes = useStyles();
    const [type, settype] = React.useState('');
    const handleChange = (event) => {
        settype(event.target.value);
    };
    return (
        <div className={classes.root}>
            <div className={classes.title}>Want to list your organization and events? Apply here!</div>
            <div className={classes.border}>
                <div className={classes.leftBox}>
                    <div className={classes.image}/>
                    <div className={classes.searchBox}>
                        <FormControl className={classes.select}>
                            <Select value={type} onChange={handleChange}>
                                <MenuItem value={10}>Event</MenuItem>
                                <MenuItem value={20}>Organization</MenuItem>
                            </Select>
                        </FormControl>
                        <InputBase className={classes.input} placeholder={"Find event or organization..."}/>
                        <SearchIcon className={classes.search}/>
                    </div>
                </div>
                <div className={classes.button}>LOGIN</div>
            </div>
        </div>
    );
}
