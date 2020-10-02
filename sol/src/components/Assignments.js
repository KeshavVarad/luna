import React, { useEffect, useState } from 'react';
import '../App.css';
import UserNav from './navs/UserNav';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const date_and_time = require('date-and-time');

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const titleCase = (string) => {
    var word = string[0].toUpperCase() + string.slice(1);
    return word;
};



export default function Assignments(props) {

    useEffect(() => {
        fetchData();
    }, [props.assignments]);


    const [assignments, setAssignments] = useState({
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
    });



    const fetchData = async () => {
        const assignmentData = await fetch('/api/assignments');
        const assignments = await assignmentData.json();
        setAssignments(assignments);
    };

    const classes = useStyles();

    return (
        <div>
            <UserNav />
            <h1>Assignments</h1>
            {Object.keys(assignments).map((day) => (
                <div>
                    <h2>{titleCase(day)}</h2>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Assignment Title</TableCell>
                                    <TableCell align="right">Due Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignments[day].map((row) => {
                                    row.dueTime.minutes = row.dueTime.minutes?row.dueTime.minutes:0;
                                    var month = `${(row.dueDate.month>10)?row.dueDate.month:`0${row.dueDate.month}`}`;
                                    var day = `${(row.dueDate.day>10)?row.dueDate.day:`0${row.dueDate.day}`}`;
                                    var hour = `${(row.dueTime.hours>10)?row.dueTime.hours:`0${row.dueTime.hours}`}`;
                                    var minute = `${(row.dueTime.minutes>10)?row.dueTime.minutes:`0${row.dueTime.minutes}`}`;
                                    var dateString = `${row.dueDate.year}-${month}-${day}T${hour}:${minute}Z`;


                                    const patternTime = date_and_time.compile('hh:mm A');
                                    var dTime = date_and_time.format(new Date(dateString), patternTime);



                                    return (
                                        <TableRow key={row.title}>
                                            <TableCell component="th" scope="row">
                                                <Typography>
                                                    <Link href={row.alternateLink} target="_blank" color="inherit">{row.title}</Link>
                                                </Typography>
                                                 
                                            </TableCell>
                                            <TableCell align="right">{dTime}</TableCell>
                                        </TableRow>
                                    )
                                }
                            )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ))}


        </div>
    );
};


