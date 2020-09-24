import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
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
        window.location.href = "http://localhost:3000/api/logout";
        setProfileAnchorEl(null);
    };

    const handleMenuClick = (path) => {
        history.push(path);
        setMenuAnchorEl(null);
    };

    const handleMenu = (event) => {
        setMenuAnchorEl(event.currentTarget);
    }

    const handleProfileMenu = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfile = () => {
        setProfileAnchorEl(null);
    };


    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <div>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={menuAnchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={menuOpen}
                            onClose={() => setMenuAnchorEl(null)}
                        >
                            <MenuItem onClick={() => handleMenuClick('/assignments')}>Assignments</MenuItem>
                            <MenuItem onClick={() => handleMenuClick('/courses')}>Courses</MenuItem>
                        </Menu>
                    </div>
                    <Typography variant="h6" className={classes.title}>
                        Luna
                    </Typography>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenu}
                            color="inherit"
                        >
                            <AccountCircle />
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
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>

                </Toolbar>
            </AppBar>
        </div>
    );
}



export default withRouter(UserNav);