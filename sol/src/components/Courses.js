import React, { useState, useEffect } from 'react';
import '../App.css';
import UserNav from './navs/UserNav';
import Button from '@material-ui/core/Button';

function Courses(props) {

    useEffect(() => {
        fetchData();
    }, [props.courses]);

    const [courses, setCourses] = useState([]);

    const fetchData = async () => {
        const courseData = await fetch('/api/google/courses');
        const courses = await courseData.json();

        console.log("Courses: ", courses);
        setCourses(courses);
    }



    return (
        <div>
            <UserNav />
            <h1>Courses</h1>
            <Button href="/api/canvasLogin">Add Canvas</Button>
        </div>
    )
}

export default Courses;
