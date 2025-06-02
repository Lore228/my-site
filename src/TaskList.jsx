import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');

      if (error) {
        console.error('Eroare la fetch:', error);
      } else {
        setTasks(data);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Lista Task-uri</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.completed ? 'Terminat' : 'În curs'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
