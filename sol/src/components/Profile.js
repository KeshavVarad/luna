import React, { useState, useEffect } from 'react';
import '../App.css';
import UserNav from './navs/UserNav';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const axios = require('axios');

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    form: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
};



function Profile(props) {

    useEffect(() => {
        fetchData();
    }, [props.userInfo]);

    const classes = useStyles();

    const [primaryUserInfo, setPrimaryUserInfo] = useState({});
    const [secondaryUserInfo, setSecondaryUserInfo] = useState([{ email: "NONE" }]);
    const [canvasUserInfo, setCanvasUserInfo] = useState([{ name: "NONE" }]);
    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = (
        <Paper style={modalStyle} className={classes.paper}>
            <Typography>
                Please put in the access token from your Canvas account.
            </Typography>
            <form className={classes.form} noValidate autoComplete="off">
                <TextField
                    label="Access Token"
                    onKeyPress={async (event) => {
                        if (event.key === 'Enter') {
                            await axios.post(
                                '/api/canvas/addAccount',
                                { accessToken: event.target.value }
                            )
                        }
                    }}
                />
            </form>
        </Paper>
    );


    const fetchData = async () => {
        const userData = await fetch('/api/userInfo');
        const userInfo = await userData.json();
        console.log("User Info: ", userInfo.primary);
        console.log("Secondary User Info: ", userInfo.secondary);
        setPrimaryUserInfo(userInfo.primary);
        if (userInfo.secondary.length >= 1) {
            setSecondaryUserInfo(userInfo.secondary);
        }
        if (userInfo.canvas.length >= 1) {
            setCanvasUserInfo(userInfo.canvas);
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
                        <ListItemText primary="Secondary Google Accounts" />
                    </ListItem>
                    {secondaryUserInfo.map((user) => (
                        <ListItem>
                            <ListItemText secondary={user.email} />
                        </ListItem>
                    ))}
                    <ListItem>
                        <ListItemText primary="Canvas Accounts" />
                    </ListItem>
                    {canvasUserInfo.map((user) => (
                        <ListItem>
                            <ListItemText secondary={user.name} />
                        </ListItem>
                    ))}

                    <ListItemLink href="/api/google/addAccount">
                        <ListItemText primary="Add Google Account" />
                    </ListItemLink>
                    <ListItem button onClick={handleOpen}>
                        <ListItemText primary="Add Canvas Account" />
                    </ListItem>
                </List>
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    {body}
                </Modal>
            </Container>

        </div>
    )
}



export default Profile;
