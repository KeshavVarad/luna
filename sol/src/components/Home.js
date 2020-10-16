import React from 'react';
import '../App.css';
import HomeNav from './navs/HomeNav';
import Container from '@material-ui/core/Container';
import image1 from '../images/Image1.png';
import image2 from '../images/Image2.jpeg';
import image3 from '../images/Image3.jpeg';
import image4 from '../images/Image4.jpg';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
      },
      gridList: {
        width: 900,
        height: 500,
      },
}));

const tileData = [
    {
        img: image1
    },
    {
        img: image2
    },
    {
        img: image3
    },
    {
        img: image4
    },
]

function Home(props) {

    const classes = useStyles();



    return (
        <div>
            <HomeNav />
            <Box className={classes.root} pt={5}>
                <GridList className={classes.gridList} cols={2}>
                    {tileData.map((tile) => (
                        <GridListTile key={tile.img}>
                            <img src={tile.img} />
                        </GridListTile>
                    ))}
                </GridList>
            </Box>
            <Container>
                <Typography variant="h2">About</Typography>
                <Typography variant="body1">
                Luna is a website built to help students keep up with their assignments. It can be pretty difficult to have to check
                two or more different Learning Management Systems for assignments. Sometimes you forget. And that can be really bad for
                your grade. Luna takes all of the assignments of different LMS's and puts them into one place for students to check.
                </Typography>
            </Container>
        </div>
    )
}

export default Home;