import React, { useState, useEffect } from 'react'
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    Target,
    Settings,
    LogOut,
    Plus,
    X,
    FileText,
    Calendar,
    Layers,
    Search,
    MoreHorizontal,
    Save,
    CheckCircle2,
    RefreshCw,
    History,
    ListTodo,
    TrendingUp,
    Download,
    Trash2,
    Filter,
    Clock,
    Zap,
    AlertCircle,
    Bell,
    PlusCircle,
    Activity,
    Sun,
    Moon
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
const INITIAL_FACULTIES = [
    { id: 'f1', name: 'Dr. Sarah Connor', role: 'Professor', dept: 'CSE' },
    { id: 'f2', name: 'Dr. Alan Turing', role: 'Assoc. Prof', dept: 'AI-DS' },
    { id: 'f3', name: 'Prof. Grace Hopper', role: 'Professor', dept: 'IT' },
    { id: 'f4', name: 'Dr. John von Neumann', role: 'Asst. Prof', dept: 'CSE' },
    { id: 'f5', name: 'Prof. Ada Lovelace', role: 'Assoc. Prof', dept: 'AI-DS' },
    { id: 'f6', name: 'Admin User', role: 'System Admin', dept: 'SYS-ADMIN' },
]

const INITIAL_TASKS = [
    { id: 't1', facultyId: 'f1', title: 'Syllabus Revamp', deadline: '2026-03-15', status: 'progress' },
    { id: 't2', facultyId: 'f2', title: 'Model Training Lab Setup', deadline: '2026-03-01', status: 'done' },
    { id: 't3', facultyId: 'f3', title: 'Network Security Audit', deadline: '2026-03-20', status: 'progress' },
    { id: 't4', facultyId: 'f4', title: 'Mid-term Paper Setting', deadline: '2026-03-10', status: 'todo' },
    { id: 't5', facultyId: 'f5', title: 'Research Grant Proposal', deadline: '2026-04-05', status: 'progress' },
]

const CustomStatusSelect = ({ status, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const getLabel = (val) => {
        if(val === 'todo') return 'Planned';
        if(val === 'progress') return 'In Progress';
        return 'Completed';
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <div 
                className={`status-badge ${status}`} 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'max-content' }}
            >
               {getLabel(status)}
               <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>▼</span>
            </div>
            {isOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem', zIndex: 100, boxShadow: 'var(--glass-shadow-deep)', display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '130px', backdropFilter: 'blur(20px)' }}>
                    {['todo', 'progress', 'done'].map(val => (
                         <div 
                            key={val}
                            onClick={() => { onChange(val); setIsOpen(false); }}
                            style={{ 
                                padding: '0.5rem 0.75rem', 
                                margin: 0, 
                                fontSize: '0.75rem', 
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                background: val === status ? 'var(--bg-hover)' : 'transparent', 
                                color: 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = val === status ? 'var(--bg-hover)' : 'transparent'}
                        >
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: val === 'todo' ? 'var(--text-muted)' : val === 'progress' ? '#4f46e5' : '#059669' }}></div>
                            {getLabel(val)}
                        </div>
                    ))}
                </div>
            )}
            {isOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setIsOpen(false)} />}
        </div>
    )
}

export default function App() {
    const [faculties, setFaculties] = useState(() => {
        const saved = localStorage.getItem('faculties');
        return saved ? JSON.parse(saved) : INITIAL_FACULTIES;
    });
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : INITIAL_TASKS;
    });

    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    });

    const [activity, setActivity] = useState(() => {
        const saved = localStorage.getItem('activity');
        return saved ? JSON.parse(saved) : [];
    });

    const [studentData, setStudentData] = useState(() => {
        const saved = localStorage.getItem('studentData');
        return saved ? JSON.parse(saved) : [
            { dept: 'CSE', y1: 60, y2: 58, y3: 49, y4: 63, boys: 130, girls: 100 },
            { dept: 'AI-DS', y1: 58, y2: 49, y3: 27, y4: 20, boys: 80, girls: 74 },
            { dept: 'IT', y1: 60, y2: 43, y3: 27, y4: 25, boys: 90, girls: 65 },
            { dept: 'SYS-ADMIN', y1: 0, y2: 0, y3: 0, y4: 0, boys: 0, girls: 0 }
        ];
    });

    const [dashboardTitle, setDashboardTitle] = useState(() => localStorage.getItem('dashboardTitle') || "ScholarSync Command Center");
    const [hodName, setHodName] = useState(() => localStorage.getItem('hodName') || "Dean of Faculty");
    const [hodCSE, setHodCSE] = useState(() => localStorage.getItem('hodCSE') || "HoD - CSE");
    const [hodAIDS, setHodAIDS] = useState(() => localStorage.getItem('hodAIDS') || "HoD - AI & DS");
    const [hodIT, setHodIT] = useState(() => localStorage.getItem('hodIT') || "HoD - IT");
    const [hodSysAdmin, setHodSysAdmin] = useState(() => localStorage.getItem('hodSysAdmin') || "Head - System Admin");

    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'dashboard');
    const [dashDeptPanel, setDashDeptPanel] = useState('CSE');
    const [subTab, setSubTab] = useState('Directives');
    const [searchQuery, setSearchQuery] = useState('')
    const [deptFilter, setDeptFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [priorityFilter, setPriorityFilter] = useState('All')
    const [facultySearch, setFacultySearch] = useState('')
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Migration of old strings to new abbreviations
        if (hodCSE === "HoD - CS & Engineering") setHodCSE("HoD - CSE");
        if (hodAIDS === "HoD - AI & Data Science") setHodAIDS("HoD - AI & DS");
        if (hodIT === "HoD - Info Technology") setHodIT("HoD - IT");
        if (dashboardTitle === "Faculty of CS & Engineering") setDashboardTitle("Faculty of CSE");
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.className = `${theme}-theme`;
    }, [theme]);

    const [showReportModal, setShowReportModal] = useState(false)
    const [reportMonth, setReportMonth] = useState('2026-03')
    const [saveStatus, setSaveStatus] = useState('idle') // idle, saving, saved

    const handleSave = () => {
        setSaveStatus('saving');
        localStorage.setItem('faculties', JSON.stringify(faculties));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.setItem('activity', JSON.stringify(activity));
        localStorage.setItem('studentData', JSON.stringify(studentData));
        localStorage.setItem('dashboardTitle', dashboardTitle);
        localStorage.setItem('theme', theme);
        localStorage.setItem('hodName', hodName);
        localStorage.setItem('hodCSE', hodCSE);
        localStorage.setItem('hodAIDS', hodAIDS);
        localStorage.setItem('hodIT', hodIT);
        localStorage.setItem('hodSysAdmin', hodSysAdmin);
        localStorage.setItem('activeTab', activeTab);

        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }, 800);
    }
    
    // Helpers
    const getFaculty = (facultyId) => faculties.find(f => f.id === facultyId)
    
    const getDeptLabel = (dept) => {
        const normalized = dept?.toUpperCase() || '';
        if (normalized.includes('CS') || normalized === 'CSE') return 'CSE';
        if (normalized.includes('AI') || normalized === 'AI-DS') return 'AI & DS';
        if (normalized.includes('INFO') || normalized.includes('IT')) return 'IT';
        if (normalized.includes('SYS') || normalized === 'SYS-ADMIN') return 'System Admin';
        return dept;
    }

    const isCurrentDept = (target) => {
        const current = activeTab?.toUpperCase() || '';
        const check = target?.toUpperCase() || '';
        if (current === check) return true;
        if (current === 'CSE' && (check.includes('CS') || check === 'CSE')) return true;
        if (current === 'AI-DS' && (check.includes('AI') || check === 'AI-DS')) return true;
        if (current === 'IT' && (check.includes('INFO') || check === 'IT')) return true;
        return false;
    }

    const getTaskStats = (taskList) => {
        return {
            total: taskList.length,
            planned: taskList.filter(t => ['todo', 'pending', 'planned'].includes(t.status?.toLowerCase())).length,
            inProgress: taskList.filter(t => ['progress', 'started', 'in-progress', 'active'].includes(t.status?.toLowerCase())).length,
            completed: taskList.filter(t => ['done', 'completed', 'finalized'].includes(t.status?.toLowerCase())).length
        };
    };

    const logActivity = (text, type = 'info') => {
        const newLog = { id: Date.now(), text, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setActivity(prev => [newLog, ...prev].slice(0, 10));
    }

    const updateTask = (id, field, value) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                if (field === 'status' && value === 'done') logActivity(`Completed: ${t.title}`, 'check');
                if (field === 'status' && value === 'progress') logActivity(`In Progress: ${t.title}`, 'info');
                return { ...t, [field]: value };
            }
            return t;
        }))
    }

    const exportToCSV = () => {
        const headers = ["Task Title", "Faculty Member", "Department", "Status", "Deadline"];
        const rows = tasks.map(t => {
            const f = getFaculty(t.facultyId);
            return [
                t.title,
                f?.name || 'N/A',
                f?.dept || 'N/A',
                t.status,
                t.deadline
            ].join(",");
        });
        
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Academic_Assessment_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Filtering Logic
    let filteredTasks = tasks.map(t => ({ ...t, faculty: getFaculty(t.facultyId) })).filter(t => t.faculty);

    if (deptFilter !== 'All') {
        filteredTasks = filteredTasks.filter(t => t.faculty.dept === deptFilter);
    }
    if (statusFilter !== 'All') {
        filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
    }
    if (priorityFilter !== 'All') {
        filteredTasks = filteredTasks.filter(t => (t.priority || 'medium') === priorityFilter);
    }
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(t =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }
    if (facultySearch) {
        filteredTasks = filteredTasks.filter(t => t.facultyId === facultySearch)
    }

    const currentDeptName = activeTab === 'dashboard' ? 'Overview' : activeTab;
    const currentDeptFaculties = faculties.filter(f => currentDeptName === 'Overview' || isCurrentDept(f.dept));
    const currentDeptTasks = filteredTasks.filter(t => currentDeptName === 'Overview' || isCurrentDept(t.faculty.dept));

    const addTask = () => {
        const newId = 't' + Date.now();
        const newTask = { id: newId, facultyId: currentDeptFaculties[0]?.id || faculties[0]?.id || '', title: 'New Task', deadline: '', status: 'todo', priority: 'medium' };
        setTasks([newTask, ...tasks]);
        logActivity(`New task allotted to ${getFaculty(newTask.facultyId)?.name || 'Faculty Member'}`);
    }

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id))
    }

    // --- TODO LIST HANDLERS ---
    const addTodo = (targetDate = null) => {
        const dateStr = targetDate || new Date().toISOString().split('T')[0];
        const newTodo = { id: Date.now(), text: 'New Daily Task', completed: false, date: dateStr };
        setTodos([newTodo, ...todos]);
        logActivity(`Added academic task for ${dateStr}`);
    }
    const updateTodo = (id, text) => setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    const toggleTodo = (id) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const deleteTodo = (id) => setTodos(prev => prev.filter(t => t.id !== id));

    // Handlers for Faculty Table Inline Edits
    const updateFaculty = (id, field, value) => {
        setFaculties(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f))
    }

    const addFaculty = () => {
        const newId = 'f' + Date.now();
        const newDept = activeTab !== 'dashboard' ? activeTab : 'CSE';
        setFaculties([{ id: newId, name: 'Faculty Name', role: 'Designation', dept: newDept }, ...faculties])
    }

    const deleteFaculty = (id) => {
        setFaculties(prev => prev.filter(f => f.id !== id))
        setTasks(prev => prev.filter(t => t.facultyId !== id))
    }

    // Report Generation
    const generateReport = () => {
        const month = reportMonth.split('-')[1];
        return tasks
            .filter(t => t.deadline.includes(`2026-${month}`))
            .map(t => ({ ...t, faculty: getFaculty(t.facultyId) }))
            .filter(t => t.faculty)
    }



    const renderHistory = () => {
        const completedTasks = tasks.filter(t => t.status === 'done').map(t => ({...t, faculty: getFaculty(t.facultyId)}));
        return (
            <div className="content-scrollable scrollable animate-up">
                <h2 className="page-title">Task History</h2>
                <div style={{ padding: '0 0 2rem 0' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Archived list of all completed assignments.</p>
                </div>
                <table className="notion-table">
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Faculty</th>
                            <th>Completed Date</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedTasks.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No completed tasks in history yet.</td></tr>}
                        {completedTasks.map(t => (
                            <tr key={t.id}>
                                <td style={{ fontWeight: 600 }}>{t.title}</td>
                                <td>{t.faculty?.name}</td>
                                <td>{t.deadline || 'N/A'}</td>
                                <td><span className="status-badge progress">{t.faculty?.dept}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const renderTodoList = () => {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

        const groupedTodos = todos.reduce((acc, todo) => {
            const date = todo.date;
            if (!acc[date]) acc[date] = [];
            acc[date].push(todo);
            return acc;
        }, {});

        const sortedDates = Object.keys(groupedTodos).sort().reverse();

        return (
            <div className="content-scrollable scrollable animate-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 className="page-title" style={{ margin: 0 }}>Faculty Preparation Log</h2>
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Plan tasks for tomorrow and review historical records</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" onClick={() => addTodo(tomorrow)}><Calendar size={18} /> Plan for Tomorrow</button>
                        <button className="btn btn-primary" onClick={() => addTodo()}><Plus size={18} /> Add for Today</button>
                    </div>
                </div>

                <div className="todo-container">
                    {sortedDates.map(date => {
                        const isToday = date === today;
                        const isFuture = date > today;
                        return (
                            <div key={date} style={{ marginBottom: '3rem', background: isToday ? 'var(--bg-card)' : 'transparent', padding: isToday ? '1.5rem' : '0', borderRadius: '24px', border: isToday ? '1px solid var(--border-rich)' : 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', color: isToday ? 'var(--primary)' : isFuture ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                                        <Clock size={20} /> 
                                        {isToday ? 'Today\'s Academic Tasks' : isFuture ? 'Upcoming Tasks (' + date + ')' : 'Archived Tasks (' + date + ')'}
                                    </h3>
                                    {!isFuture && !isToday && <span className="status-badge" style={{ opacity: 0.6 }}>History</span>}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {groupedTodos[date].map(todo => (
                                        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                                            <div className={`todo-checkbox ${todo.completed ? 'checked' : ''}`} onClick={() => toggleTodo(todo.id)}>
                                                {todo.completed && <CheckCircle2 size={18} color="white" />}
                                            </div>
                                            <input 
                                                className="inline-input todo-text" 
                                                value={todo.text} 
                                                onChange={(e) => updateTodo(todo.id, e.target.value)}
                                                style={{ textDecoration: todo.completed ? 'line-through' : 'none', opacity: todo.completed ? 0.6 : 1 }}
                                            />
                                            <button className="btn btn-ghost" onClick={() => deleteTodo(todo.id)} style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {todos.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                            <ListTodo size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ color: 'var(--text-muted)' }}>The academic task schedule is currently empty.</h4>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const renderPerformance = () => {
        const departments = ['CSE', 'AI-DS', 'IT', 'SYS-ADMIN'];
        const workloadData = faculties.map(f => {
            const facultyTasks = tasks.filter(t => t.facultyId === f.id);
            return {
                name: f.name,
                dept: f.dept,
                completed: facultyTasks.filter(t => t.status === 'done').length,
                started: facultyTasks.filter(t => t.status === 'progress').length,
                pending: facultyTasks.filter(t => t.status === 'todo').length,
                total: facultyTasks.length
            }
        });

        return (
            <div className="content-scrollable scrollable animate-up">
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="page-title">Faculty Performance Analysis</h2>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Unit-wise workload distribution and finalized academic tasks</p>
                </div>

                {departments.map(dept => {
                    const deptFaculty = workloadData.filter(d => d.dept === dept);
                    if (deptFaculty.length === 0) return null;

                    return (
                        <div key={dept} style={{ marginBottom: '4rem', padding: '2rem', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{getDeptLabel(dept)} Unit Efficiency</h3>
                                <div style={{ background: 'var(--status-progress)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700 }}>
                                    {deptFaculty.length} Faculty Members Active
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={deptFaculty}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                                            <Tooltip 
                                                cursor={{ fill: 'var(--bg-hover)' }}
                                                contentStyle={{ borderRadius: '12px', background: 'var(--bg-modal)', border: '1px solid var(--border)', boxShadow: 'var(--glass-shadow-deep)', color: 'var(--text-main)' }} 
                                            />
                                            <Bar dataKey="completed" name="Finalized" fill="var(--success)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="started" name="Active" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="pending" name="Pending" fill="var(--text-muted)" opacity={0.3} radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {deptFaculty.map(data => (
                                        <div key={data.name} style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ fontWeight: 700 }}>{data.name}</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{data.total} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total</span></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                                                <div style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>{data.completed} Completed</div>
                                                <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700 }}>{data.started} In Progress</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>{data.pending} Planned</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }

    const renderDashboard = () => {
        const stats = getTaskStats(tasks);
        const totalAssignments = stats.total;
        const startedAssignments = stats.inProgress;
        const completedAssignments = stats.completed;
        
        const totalFaculty = faculties.length;
        const totalStudents = studentData.reduce((acc, d) => acc + d.y1 + d.y2 + d.y3 + d.y4, 0);
        const totalBoys = studentData.reduce((acc, d) => acc + (d.boys || 0), 0);
        const totalGirls = studentData.reduce((acc, d) => acc + (d.girls || 0), 0);

        const urgentTasks = tasks
            .filter(t => t.status !== 'done' && (t.priority === 'high'))
            .map(t => ({ ...t, faculty: getFaculty(t.facultyId) }))
            .slice(0, 3);

        const studentChartData = studentData.map(d => ({
            name: getDeptLabel(d.dept),
            'Year I': d.y1,
            'Year II': d.y2,
            'Year III': d.y3,
            'Year IV': d.y4,
            total: d.y1 + d.y2 + d.y3 + d.y4
        }));

        const genderData = [
            { name: 'Male', value: totalBoys, color: 'var(--primary)' },
            { name: 'Female', value: totalGirls, color: '#64748b' }
        ];

        return (
            <div className="content-scrollable scrollable animate-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div>
                        <input
                            className="page-title"
                            value={dashboardTitle}
                            onChange={(e) => setDashboardTitle(e.target.value)}
                            style={{ borderBottom: '2px solid var(--border)', borderRadius: 0, marginBottom: '0.5rem' }}
                        />
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Command Center • {new Date().toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="stat-card" style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-card)' }}>
                           <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>STUDENT BODY</div>
                           <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{totalStudents}</div>
                        </div>
                        <div className="stat-card" style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-card)' }}>
                           <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL FACULTY</div>
                           <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalFaculty}</div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Department Tasks Overview Panel */}
                <div className="perf-card" style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Layers size={24} color="var(--primary)" /> Academic Task Distribution</h3>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                        {['CSE', 'AI-DS', 'IT', 'SYS-ADMIN'].map(dept => (
                            <button 
                                key={dept}
                                onClick={() => setDashDeptPanel(dept)}
                                className={`btn ${dashDeptPanel === dept ? 'btn-primary' : 'btn-ghost'}`}
                                style={{ flex: 1, boxShadow: dashDeptPanel === dept ? 'var(--glass-shadow-glow)' : 'none', border: dashDeptPanel === dept ? '1px solid var(--primary)' : '1px solid transparent' }}
                            >
                                {getDeptLabel(dept)}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {(() => {
                            const deptTasks = tasks.map(t => ({...t, faculty: getFaculty(t.facultyId)})).filter(t => t.faculty?.dept === dashDeptPanel);
                            const deptStats = getTaskStats(deptTasks);
                            return (
                                <>
                                    <div style={{ background: 'var(--bg-sidebar)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{deptStats.planned}</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.5rem' }}>Planned</div>
                                    </div>
                                    <div style={{ background: 'var(--bg-sidebar)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 0 15px rgba(99, 102, 241, 0.1)' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{deptStats.inProgress}</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginTop: '0.5rem' }}>In Progress</div>
                                    </div>
                                    <div style={{ background: 'var(--bg-sidebar)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{deptStats.completed}</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginTop: '0.5rem' }}>Completed</div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
                    <div className="perf-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Users size={24} color="var(--primary)" /> Year-wise Strength</h3>
                        </div>
                        <div style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={studentChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                                    <Tooltip contentStyle={{borderRadius: '12px', background: 'var(--bg-modal)', border: '1px solid var(--border)', boxShadow: 'var(--glass-shadow-deep)', color: 'var(--text-main)'}} />
                                    <Bar dataKey="Year I" stackId="a" fill="var(--primary)" opacity={0.6} radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="Year II" stackId="a" fill="var(--primary)" opacity={0.8} radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="Year III" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="Year IV" stackId="a" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="perf-card">
                         <h3 style={{ margin: '0 0 2rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity size={24} color="var(--primary)" /> Student Demographics</h3>
                         <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={genderData} innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                                        {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '12px', background: 'var(--bg-modal)', border: '1px solid var(--border)', boxShadow: 'var(--glass-shadow-deep)', color: 'var(--text-main)'}} />
                                </PieChart>
                            </ResponsiveContainer>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{totalBoys}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Male</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>{totalGirls}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Female</div>
                            </div>
                         </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
                    <div className="perf-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Zap size={24} color="var(--primary)" /> Urgent Priorities</h3>
                            <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => setActiveTab('CSE')}>View All</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {urgentTasks.length > 0 ? urgentTasks.map(t => (
                                <div key={t.id} className="todo-item" style={{ padding: '1.25rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assigned to: <b>{t.faculty?.name}</b></div>
                                    </div>
                                    <span className="priority-badge priority-high">CRITICAL</span>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <img src="C:/Users/Vignesh LS/.gemini/antigravity/brain/3dc0f5e0-54bb-4102-b64f-e9d8b97278f4/empty_state_illustration_1773223370525.png" alt="Empty" style={{ width: '120px', marginBottom: '1rem', opacity: 0.6 }} className="floating-illust" />
                                    <div style={{ color: 'var(--text-muted)' }}>No urgent priorities found.</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="perf-card" style={{ padding: '1.5rem 0' }}>
                        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Activity size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Live Activity</h3>
                        </div>
                        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {activity.length > 0 ? activity.map(log => (
                                <div key={log.id} className="activity-card">
                                    <div className="activity-icon" style={{ background: log.type === 'check' ? 'var(--success)' : 'var(--primary-glow)', color: log.type === 'check' ? 'white' : 'var(--primary)' }}>
                                        {log.type === 'check' ? <CheckCircle2 size={16} /> : <Zap size={16} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{log.text}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.time}</div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent activity to show.</div>
                            )}
                        </div>
                    </div>
                </div>


            </div>
        )
    }

    const renderTasksAndFaculties = () => (
        <div className="content-scrollable scrollable animate-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 800 }}>{getDeptLabel(activeTab)} Content</h2>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Operational center for {getDeptLabel(activeTab)}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {subTab === 'Directives' ? (
                        <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.6rem 1.2rem' }} onClick={addTask}><PlusCircle size={18} /> New Task</button>
                    ) : (
                        <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.6rem 1.2rem' }} onClick={addFaculty}><PlusCircle size={18} /> Add Faculty Member</button>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <button 
                    onClick={() => setSubTab('Directives')}
                    style={{ background: 'none', border: 'none', color: subTab === 'Directives' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', padding: '0.5rem 1rem', borderBottom: subTab === 'Directives' ? '3px solid var(--primary)' : '3px solid transparent' }}
                >
                    Tasks
                </button>
                <button 
                    onClick={() => setSubTab('Personnel')}
                    style={{ background: 'none', border: 'none', color: subTab === 'Personnel' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', padding: '0.5rem 1rem', borderBottom: subTab === 'Personnel' ? '3px solid var(--primary)' : '3px solid transparent' }}
                >
                    Faculty Members
                </button>
            </div>

            {subTab === 'Directives' ? (
                <>
                    <div className="filter-bar">
                        <div className="search-wrapper">
                            <Search size={18} color="var(--text-muted)" />
                            <input type="text" className="inline-input" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <select className="badge-select" value={facultySearch} onChange={e => setFacultySearch(e.target.value)}>
                                <option value="">All Faculty</option>
                                {currentDeptFaculties.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                            <select className="badge-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="All">All Status</option>
                                <option value="todo">Planned</option>
                                <option value="progress">In Progress</option>
                                <option value="done">Completed</option>
                            </select>
                            <select className="badge-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                                <option value="All">All Priority</option>
                                <option value="high">Critical</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    <table className="notion-table">
                        <thead>
                            <tr>
                                <th style={{ width: '30%' }}>Task Title</th>
                                <th style={{ width: '20%' }}>Assigned Faculty</th>
                                <th style={{ width: '15%' }}>Priority</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th style={{ width: '15%' }}>Deadline</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDeptTasks.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No tasks recorded.</td></tr>}
                            {currentDeptTasks.map(t => (
                                <tr key={t.id}>
                                    <td>
                                        <input
                                            type="text"
                                            className="inline-input"
                                            style={{ fontWeight: 600 }}
                                            value={t.title}
                                            onChange={(e) => updateTask(t.id, 'title', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className="badge-select"
                                            value={t.facultyId}
                                            onChange={(e) => updateTask(t.id, 'facultyId', e.target.value)}
                                            style={{ width: '100%', textOverflow: 'ellipsis' }}
                                        >
                                            {currentDeptFaculties.map(f => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            className={`priority-badge priority-${t.priority || 'medium'}`}
                                            value={t.priority || 'medium'}
                                            onChange={(e) => updateTask(t.id, 'priority', e.target.value)}
                                            style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                                        >
                                            <option value="high">Critical</option>
                                            <option value="medium">Normal</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </td>
                                    <td>
                                        <CustomStatusSelect
                                            status={t.status}
                                            onChange={(newStatus) => updateTask(t.id, 'status', newStatus)}
                                        />
                                    </td>
                                    <td style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Calendar size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', pointerEvents: 'none', zIndex: 1 }} />
                                            <DatePicker
                                                selected={t.deadline ? new Date(t.deadline) : null}
                                                onChange={(date) => {
                                                    updateTask(t.id, 'deadline', date ? format(date, 'yyyy-MM-dd') : '')
                                                }}
                                                className="inline-input"
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Set deadline..."
                                                style={{ paddingLeft: '2.5rem' }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost" style={{ padding: '0.2rem', color: 'var(--text-muted)' }} onClick={() => deleteTask(t.id)}>
                                            <X size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <table className="notion-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Faculty Name</th>
                            <th style={{ width: '40%' }}>Designation</th>
                            <th style={{ width: '20%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDeptFaculties.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No faculty recorded in this unit.</td></tr>}
                        {currentDeptFaculties.map(f => (
                            <tr key={f.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="inline-input"
                                        style={{ fontWeight: 600 }}
                                        value={f.name}
                                        onChange={(e) => updateFaculty(f.id, 'name', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="inline-input"
                                        value={f.role}
                                        onChange={(e) => updateFaculty(f.id, 'role', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => deleteFaculty(f.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )

    const urgentDeadlinesCount = tasks.filter(t => {
        if (t.status === 'done' || !t.deadline) return false;
        const diffTime = new Date(t.deadline) - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2 && diffDays >= -30;
    }).length;

    const renderSettings = () => (
        <div className="content-scrollable scrollable animate-up">
            <h2 className="page-title">General Settings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                <div className="perf-card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Sun size={24} color="var(--primary)" /> Appearance & Theme</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Personalize your dashboard workspace with various visual styles.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { id: 'light', name: 'Academic Light', desc: 'Standard professional workspace' },
                            { id: 'dark', name: 'Scholarly Dark', desc: 'Deep focus night mode' },
                            { id: 'batman', name: 'Night Knight (Batman)', desc: 'Vigilante aesthetic' },
                            { id: 'superman', name: 'Man of Steel (Superman)', desc: 'Heroic blue and red' },
                            { id: 'spiderman', name: 'Wall Crawler (Spider-Man)', desc: 'Dynamic web aesthetic' },
                            { id: 'hulk', name: 'Gamma Rage (Hulk)', desc: 'Bio-organic green' },
                            { id: 'hitman', name: 'Silent Assassin (Hitman)', desc: 'Formal monochromatic' }
                        ].map(t => (
                            <div 
                                key={t.id} 
                                className={`todo-item ${theme === t.id ? 'active' : ''}`} 
                                onClick={() => setTheme(t.id)}
                                style={{ border: theme === t.id ? '2px solid var(--primary)' : '1px solid var(--border)', background: theme === t.id ? 'var(--bg-hover)' : 'var(--bg-card)' }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.desc}</div>
                                </div>
                                {theme === t.id && <CheckCircle2 size={24} color="var(--primary)" />}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="perf-card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Settings size={24} color="var(--primary)" /> Institutional Profile</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                         <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dashboard Title</label>
                            <input className="badge-select" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }} value={dashboardTitle} onChange={e => setDashboardTitle(e.target.value)} />
                         </div>
                         <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dean / Admin Name</label>
                            <input className="badge-select" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }} value={hodName} onChange={e => setHodName(e.target.value)} />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
                <div className="blob blob-4"></div>
            </div>
            <div className="app-container">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-header">
                        <div className="workspace">
                            <div className="workspace-icon" style={{ background: 'var(--primary-gradient)' }}>F</div>
                            <div style={{ flex: 1 }}>
                                <input
                                    value={hodName}
                                    onChange={(e) => setHodName(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800, width: '100%', outline: 'none', fontFamily: 'var(--font-heading)' }}
                                />
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Academic Administration</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '0 1.25rem 1.5rem 1.25rem' }}>
                        <div style={{ background: 'var(--status-progress)', borderRadius: '12px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-rich)' }}>
                           <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Active Tasks</div>
                           <div style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>{tasks.filter(t => t.status !== 'done').length}</div>
                        </div>
                    </div>

                    <div className="nav-section">
                        <div className="nav-label">Overview</div>
                        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            <LayoutDashboard className="icon" size={18} />
                            <span>Dashboard</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'todo' ? 'active' : ''}`} onClick={() => setActiveTab('todo')}>
                            <ListTodo className="icon" size={18} />
                            <span>Daily To-Do</span>
                        </div>
                    </div>

                    <div className="nav-section">
                        <div className="nav-label">Analytics</div>
                        <div className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>
                            <TrendingUp className="icon" size={18} />
                            <span>Performance</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                            <History className="icon" size={18} />
                            <span>Task History</span>
                        </div>
                    </div>

                    <div className="nav-section">
                        <div className="nav-label">Management</div>
                        <div className={`nav-item ${activeTab === 'CSE' ? 'active' : ''}`} onClick={() => setActiveTab('CSE')}>
                            <Target className="icon" size={18} />
                            <span>CSE</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'AI-DS' ? 'active' : ''}`} onClick={() => setActiveTab('AI-DS')}>
                            <Target className="icon" size={18} />
                            <span>AI & DS</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'IT' ? 'active' : ''}`} onClick={() => setActiveTab('IT')}>
                            <Target className="icon" size={18} />
                            <span>IT</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'SYS-ADMIN' ? 'active' : ''}`} onClick={() => setActiveTab('SYS-ADMIN')}>
                            <Layers className="icon" size={18} />
                            <span>System Admin</span>
                        </div>
                    </div>

                    <div className="nav-section">
                        <div className="nav-label">Actions</div>
                        <div
                            className={`nav-item ${saveStatus !== 'idle' ? 'saving' : ''}`}
                            onClick={handleSave}
                            style={{ color: saveStatus === 'saved' ? 'var(--success)' : 'var(--primary)' }}
                        >
                            {saveStatus === 'saving' ? <RefreshCw className="icon spin" size={18} /> :
                                saveStatus === 'saved' ? <CheckCircle2 className="icon" size={18} /> :
                                    <Save className="icon" size={18} />}
                            <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved Successfully' : 'Save Changes'}</span>
                        </div>
                        <div className="nav-item" onClick={exportToCSV}>
                            <Download className="icon" size={18} />
                            <span>Export Data</span>
                        </div>
                        <div className="nav-item" onClick={() => window.location.reload()} style={{ color: 'var(--accent)' }}>
                            <RefreshCw className="icon" size={18} />
                            <span>Refresh App</span>
                        </div>
                    </div>

                    <div className="nav-section" style={{ marginTop: 'auto', marginBottom: 0 }}>
                        <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                            <Settings className="icon" size={18} />
                            <span>Settings</span>
                        </div>
                        <div className="nav-item">
                            <LogOut className="icon" size={18} color="var(--accent)" />
                            <span style={{ color: "var(--accent)" }}>Sign Out</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {urgentDeadlinesCount > 0 && (
                        <div style={{ background: 'var(--accent)', color: 'white', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)', animation: 'slideDown 0.3s ease-out' }}>
                            <AlertCircle size={24} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Deadline Alert</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                    {urgentDeadlinesCount} allotted directive(s) are nearing their deadline or overdue!
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'todo' && renderTodoList()}
                    {activeTab === 'performance' && renderPerformance()}
                    {activeTab === 'history' && renderHistory()}
                    {activeTab === 'settings' && renderSettings()}
                    {(['CSE', 'AI-DS', 'IT', 'SYS-ADMIN'].includes(activeTab) || ['CS & Engineering', 'AI & Data Science', 'Info Technology'].includes(activeTab)) && renderTasksAndFaculties()}
                </div>

                {/* MONTHLY REPORT MODAL */}
                {showReportModal && (
                    <div className="modal-overlay scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Monthly Faculty Report</h3>
                                <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setShowReportModal(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <label style={{ margin: 0, fontWeight: 500 }}><Calendar size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Select Report Month:</label>
                                    <input
                                        type="month"
                                        className="inline-input"
                                        value={reportMonth}
                                        onChange={(e) => setReportMonth(e.target.value)}
                                        style={{ width: 'auto', border: '1px solid var(--border)', background: '#ffffff' }}
                                    />
                                </div>

                                <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '16px', background: 'transparent' }}>
                                    {generateReport().length === 0 ? (
                                        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No tasks found for the selected month.</div>
                                    ) : (
                                        <table className="notion-table" style={{ margin: 0 }}>
                                            <thead>
                                                <tr>
                                                    <th>Task</th>
                                                    <th>Faculty</th>
                                                    <th>Deadline</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {generateReport().map(t => (
                                                    <tr key={t.id}>
                                                        <td style={{ fontWeight: 500 }}>{t.title}</td>
                                                        <td style={{ color: 'var(--text-muted)' }}>{t.faculty.name} ({t.faculty.dept})</td>
                                                        <td>{t.deadline}</td>
                                                        <td style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: t.status === 'done' ? 'var(--status-done)' : t.status === 'overdue' ? 'var(--accent)' : 'inherit' }}>
                                                            {t.status}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={() => window.print()}>Export Report (Print)</button>
                                <button className="btn btn-outline" style={{ marginLeft: '0.5rem' }} onClick={() => setShowReportModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
