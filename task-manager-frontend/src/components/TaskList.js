import React from 'react';

import { Button, Col, Row, Table } from 'react-bootstrap';

const TaskList = ({ tasks, onDelete }) => {
    return (
        <div>
            <h2>Task List</h2>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => onDelete(task.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};

export default TaskList;



