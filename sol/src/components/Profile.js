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
import HighlightOff from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';


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
    const [primaryUserInfo, setPrimaryUserInfo] = useState({});
    const [secondaryUserInfo, setSecondaryUserInfo] = useState([{ email: "NONE" }]);
    const [canvasUserInfo, setCanvasUserInfo] = useState([{ name: "NONE" }]);
    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const userData = await fetch('/api/userInfo');
        const userInfo = await userData.json();
        setPrimaryUserInfo(userInfo.primary);
        if (userInfo.google.length >= 1) {
            setSecondaryUserInfo(userInfo.google);
        }
        else {
            setSecondaryUserInfo([{ email: "NONE" }]);
        }
        if (userInfo.canvas.length >= 1) {
            setCanvasUserInfo(userInfo.canvas);
        }
        else {
            setCanvasUserInfo([{ name: "NONE" }]);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async (type, id) => {
        await axios.delete(
            `/api/${type}/deleteAccount/${id}`
        );
        fetchData();
    };

    const body = (
        <Paper style={modalStyle} className={classes.paper}>
            <Typography>
                Please put in the access token from your Raleigh Charter High School Canvas account.
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
                            fetchData();
                        }
                    }}
                />
            </form>
        </Paper>
    );




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
                    {secondaryUserInfo.map((user, id) => (
                        <ListItem>
                            <ListItemText secondary={user.email} />
                            {(user.email === "NONE") ? null :
                                <IconButton
                                    onClick={() => handleDelete("google", id)}
                                >
                                    <HighlightOff />
                                </IconButton>
                            }
                        </ListItem>
                        
                    ))}
                    <ListItemLink href="/api/google/addAccount">
                        <ListItemText secondary="Add Google Account" />
                    </ListItemLink>
                    <ListItem>
                        <ListItemText primary="Canvas Accounts" />
                    </ListItem>
                    {canvasUserInfo.map((user, id) => (
                        <ListItem>
                            <ListItemText secondary={user.name} />
                            {(user.name === "NONE") ? null :
                                <IconButton
                                    onClick={() => handleDelete("canvas", id)}
                                >
                                    <HighlightOff />
                                </IconButton>
                            }
                        </ListItem>
                    ))}
                    <ListItem button onClick={handleOpen}>
                        <ListItemText secondary="Add Canvas Account" />
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
