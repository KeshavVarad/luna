import React, { useState, useEffect } from 'react';
import '../App.css';
import UserNav from './navs/UserNav';

function Courses(props) {

    useEffect(() => {
        fetchData();
    }, [props.courses]);

    const [courses, setCourses] = useState([]);

    const fetchData = async () => {
        const courseData = await fetch('/api/courses');
        const courses = await courseData.json();

        console.log("Courses: ", courses);
        setCourses(courses);
    }



    return (
        <div>
            <UserNav />
            <h1>Courses</h1>
        </div>
    )
}

export default Courses;
