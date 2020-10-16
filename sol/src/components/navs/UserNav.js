import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'flex',
        flexGrow: 1,
    },
}));

function UserNav(props) {
    const { history } = props;
    const classes = useStyles();
    const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const profileOpen = Boolean(profileAnchorEl);


    const handleLogout = () => {
        window.location.href = "/api/logout";
        setProfileAnchorEl(null);
    };


    const handleMenu = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleClick = (path) => {
        history.push(path);
        setProfileAnchorEl(null);
    };


    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        My Luna App
                    </Typography>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="profile-appbar"
                            anchorEl={profileAnchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={profileOpen}
                            onClose={() => setProfileAnchorEl(null)}
                        >
                            <MenuItem onClick={() => handleClick("/profile")}>Profile</MenuItem>
                            <MenuItem onClick={() => handleClick("/assignments")}>Assignments</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>

                </Toolbar>
            </AppBar>
        </div>
    );
}



export default withRouter(UserNav);