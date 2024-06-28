import { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO(props) {
    const [newTodo, setNewTodo] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editingTodo, setEditingTodo] = useState('');
    const [editingDescription, setEditingDescription] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo();
            setTodoData(apiData);
            setLoading(false);
        };
        fetchTodo();
    }, []);

    const getTodo = async () => {
        const options = {
            method: "GET",
            url: "http://localhost:8000/api/todo",
            headers: {
                accept: "application/json",
            }
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const addTodo = () => {
        const options = {
            method: "POST",
            url: "http://localhost:8000/api/todo",
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo,
                description: newDescription
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => [...prevData, response.data.newTodo]);
                setNewTodo('');
                setNewDescription('');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTodo = (id) => {
        const options = {
            method: "DELETE",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.filter(todo => todo._id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find(todo => todo._id === id);
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const startEditing = (id, title, description) => {
        setEditingId(id);
        setEditingTodo(title);
        setEditingDescription(description);
    };
    function removeButton() {
        var button = document.getElementById("hideButton");
        button.remove();
      }
    const saveEdit = (id) => {
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: editingTodo,
                description: editingDescription
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
                setEditingId(null);
                setEditingTodo('');
                setEditingDescription('');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>
                    Tasks
                </h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo'
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value);
                        }}
                    />
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Description'
                        value={newDescription}
                        onChange={(event) => {
                            setNewDescription(event.target.value);
                        }}
                    />
                    <button
                        id='addButton'
                        name='add'
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo();
                        }}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry, index) => (
                            <div key={entry._id} className={Styles.todo}>
                                {editingId === entry._id ? (
                                    <div className={Styles.editContainer}>
                                        <input
                                            type='text'
                                            value={editingTodo}
                                            className={Styles.editInput}
                                            onChange={(e) => setEditingTodo(e.target.value)}
                                        />
                                        
                                        <input
                                            type='text'
                                            value={editingDescription}
                                            className={Styles.editInput}
                                            onChange={(e) => setEditingDescription(e.target.value)}
                                        />
                                        <button className={Styles.saveButton} onClick={() => saveEdit(entry._id)}>Save</button>
                                    </div>
                                ) : (
                                    <span className={Styles.infoContainer}>
                                        <input
                                            type='checkbox'
                                            checked={entry.done}
                                            onChange={() => {
                                                updateTodo(entry._id);
                                            }}
                                        />
                                        <span>
                                            <strong>{entry.title}</strong> - {entry.description}
                                        </span>
                                    </span>
                                )}
                                <span
                                    style={{ cursor: 'pointer', marginLeft: '10px'}}
                                    onClick={() => {
                                        startEditing(entry._id, entry.title, entry.description);
                                    }}
                                >
                                    Edit
                                </span>
                                <span
                                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                                    onClick={() => {
                                        
                                        deleteTodo(entry._id);
                                    }}
                                >
                                    Delete
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                    )
                )}
            </div>
        </div>
    );
}
