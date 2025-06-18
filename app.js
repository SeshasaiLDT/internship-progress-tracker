const addWeekForm = document.getElementById('add-week-form');
const weekInput = document.getElementById('week-input');
const addTaskForm = document.getElementById('add-task-form');
const weekSelect = document.getElementById('week-select');
const taskInput = document.getElementById('task-input');
const estimateInput = document.getElementById('estimate-input');
const tableBody = document.querySelector('#progress-table tbody');

let weeks = [];

function updateWeekDropdown() {
  weekSelect.innerHTML = '';
  weeks.forEach((week, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = week.name;
    weekSelect.appendChild(opt);
  });
  addTaskForm.style.display = weeks.length > 0 ? 'flex' : 'none';
}

function renderTable() {
  tableBody.innerHTML = '';
  weeks.forEach((week, wIdx) => {
    let allCompleted = week.tasks.length > 0 && week.tasks.every(t => t.status === 'completed');
    week.tasks.forEach((task, tIdx) => {
      const tr = document.createElement('tr');
      tr.className = task.status;
      if (tIdx === 0) {
        const weekCell = document.createElement('td');
        weekCell.rowSpan = week.tasks.length;
        weekCell.textContent = week.name;
        weekCell.className = 'week-cell' + (allCompleted ? ' completed' : '');
        tr.appendChild(weekCell);
      }
      const taskCell = document.createElement('td');
      taskCell.className = 'task-col';
      taskCell.textContent = task.name;
      const estimateCell = document.createElement('td');
      estimateCell.className = 'estimate-col';
      estimateCell.textContent = task.estimate;
      const statusCell = document.createElement('td');
      statusCell.className = 'status-col';
      const statusSelect = document.createElement('select');
      ['completed','in-progress','stopped','abandoned'].forEach(status => {
        const opt = document.createElement('option');
        opt.value = status;
        opt.textContent = status.charAt(0).toUpperCase() + status.slice(1).replace('-',' ');
        if (task.status === status) opt.selected = true;
        statusSelect.appendChild(opt);
      });
      statusSelect.addEventListener('change', e => {
        task.status = e.target.value;
        renderTable();
      });
      statusCell.appendChild(statusSelect);
      const commentsCell = document.createElement('td');
      commentsCell.className = 'comments-col';
      const commentInput = document.createElement('input');
      commentInput.type = 'text';
      commentInput.value = task.comments || '';
      commentInput.placeholder = 'Add comment';
      commentInput.addEventListener('change', e => {
        task.comments = e.target.value;
      });
      commentsCell.appendChild(commentInput);
      tr.appendChild(taskCell);
      tr.appendChild(estimateCell);
      tr.appendChild(statusCell);
      tr.appendChild(commentsCell);
      tableBody.appendChild(tr);
    });
  });
}

addWeekForm.addEventListener('submit', e => {
  e.preventDefault();
  const weekName = weekInput.value.trim();
  if (weekName) {
    weeks.push({ name: weekName, tasks: [] });
    weekInput.value = '';
    updateWeekDropdown();
    renderTable();
  }
});

addTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  if (weeks.length === 0) return;
  const weekIdx = parseInt(weekSelect.value, 10);
  const taskName = taskInput.value.trim();
  const estimate = estimateInput.value.trim();
  if (taskName) {
    weeks[weekIdx].tasks.push({
      name: taskName,
      estimate: estimate || '',
      status: 'in-progress',
      comments: ''
    });
    taskInput.value = '';
    estimateInput.value = '';
    renderTable();
  }
});

updateWeekDropdown();
renderTable();
