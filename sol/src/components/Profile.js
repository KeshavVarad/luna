import React, { useState, useEffect } from 'react';
import '../App.css';
import UserNav from './navs/UserNav';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
};



function Profile(props) {

    useEffect(() => {
        fetchData();
    }, [props.userInfo]);

    const [primaryUserInfo, setPrimaryUserInfo] = useState({});
    const [secondaryUserInfo, setSecondaryUserInfo] = useState([{ email: "NONE" }]);

    const fetchData = async () => {
        const userData = await fetch('/api/userInfo');
        const userInfo = await userData.json();
        console.log("User Info: ", userInfo.primary);
        console.log("Secondary User Info: ", userInfo.secondary);
        setPrimaryUserInfo(userInfo.primary);
        if (userInfo.secondary.length >= 1) {
            setSecondaryUserInfo(userInfo.secondary);
        }
    };

    return (

        <div>
            <UserNav />
            <h1>Profile</h1>
            <Container>
                <List component="nav">
                    <ListItem>
                        <ListItemText primary="Name" secondary={primaryUserInfo.name} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Main Account" secondary={primaryUserInfo.email} />
                    </ListItem>
                </List>
                <Divider />
                <List component="nav" aria-label="secondary mailbox folders">
                    <ListItem>
                        <ListItemText primary="Secondary Accounts" />
                    </ListItem>
                    {secondaryUserInfo.map((user) => (
                        <ListItem>
                            <ListItemText secondary={user.email} />
                        </ListItem>
                    ))}
                    <ListItemLink href="/api/addAccount">
                        <ListItemText primary="Add Account" />
                    </ListItemLink>
                </List>
            </Container>

        </div>
    )
}



export default Profile;
