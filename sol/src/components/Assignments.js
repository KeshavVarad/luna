import React, { useEffect, useState } from 'react';
import '../App.css';
import UserNav from './navs/UserNav';

export default function Assignments(props) {

    useEffect(() => {
        fetchData();
    }, [props.assignments]);

    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState({});

    const fetchData = async () => {
        const courseData = await fetch('/api/courses');
        const courses = await courseData.json();
        const assignmentData = await fetch('/api/assignments');
        const assignments = await assignmentData.json();

        console.log('courses', courses.data);
        console.log('assignment', assignments);

        setAssignments(assignments);
        setCourses(courses.data);
    };


    return(
        <div>
            <UserNav />
            <h1>Assignments</h1>
            {courses.map(course => (
                <div>
                    <h1>{course.name}</h1>
                    <div>
                        {assignments && assignments[course.id] && assignments[course.id].map(assignment => (
                            <p>{assignment.title}</p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


