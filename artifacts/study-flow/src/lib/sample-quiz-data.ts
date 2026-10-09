export type SampleQuestion = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctOption: number;
};

const banks: Record<string, SampleQuestion[]> = {
  dbms: [
    { id: 'dbms-primary-key', topic: 'Keys', question: 'Which property must a primary key have?', options: ['It can contain duplicates', 'It uniquely identifies each row', 'It stores only text', 'It may be empty'], correctOption: 1 },
    { id: 'dbms-normalization', topic: 'Normalization', question: 'What is a main goal of normalization?', options: ['Increase duplicate data', 'Remove all relationships', 'Reduce data redundancy', 'Avoid using keys'], correctOption: 2 },
    { id: 'dbms-foreign-key', topic: 'Keys', question: 'What does a foreign key reference?', options: ['A key in another table', 'A database password', 'A column alias', 'A query result'], correctOption: 0 },
    { id: 'dbms-ddl', topic: 'SQL', question: 'Which SQL statement is commonly used to create a table?', options: ['SELECT', 'UPDATE', 'INSERT', 'CREATE TABLE'], correctOption: 3 },
    { id: 'dbms-acid', topic: 'Transactions', question: 'What does atomicity mean in a transaction?', options: ['Transactions can overlap', 'All operations happen or none do', 'Data is always encrypted', 'Queries run without indexes'], correctOption: 1 },
  ],
  operating: [
    { id: 'os-process', topic: 'Processes', question: 'What is a process?', options: ['A program currently in execution', 'A storage device', 'A network packet', 'A database table'], correctOption: 0 },
    { id: 'os-scheduler', topic: 'Scheduling', question: 'What does a CPU scheduler choose?', options: ['Which file to delete', 'Which process runs next', 'Which user can log in', 'Which disk to format'], correctOption: 1 },
    { id: 'os-deadlock', topic: 'Deadlocks', question: 'Which condition is required for deadlock?', options: ['Preemption', 'Circular wait', 'Unlimited resources', 'Single-task execution'], correctOption: 1 },
    { id: 'os-virtual-memory', topic: 'Memory', question: 'What does virtual memory allow?', options: ['Programs to use an address space beyond physical RAM', 'The CPU to skip instructions', 'Files to execute without permissions', 'A disk to act as a processor'], correctOption: 0 },
    { id: 'os-context-switch', topic: 'Processes', question: 'What is saved during a context switch?', options: ['Only the process name', 'The running process state', 'The monitor resolution', 'The network password'], correctOption: 1 },
  ],
  network: [
    { id: 'net-ip', topic: 'Addressing', question: 'What is the main purpose of an IP address?', options: ['Identify a device on an IP network', 'Encrypt every file', 'Name a database column', 'Measure CPU speed'], correctOption: 0 },
    { id: 'net-dns', topic: 'DNS', question: 'What does DNS primarily do?', options: ['Compress images', 'Translate domain names to IP addresses', 'Assign file permissions', 'Schedule CPU processes'], correctOption: 1 },
    { id: 'net-tcp', topic: 'Transport protocols', question: 'Which property is TCP designed to provide?', options: ['Reliable, ordered delivery', 'A fixed physical route', 'Image rendering', 'Local disk storage'], correctOption: 0 },
    { id: 'net-router', topic: 'Routing', question: 'What does a router forward?', options: ['Packets between networks', 'Rows between tables', 'Instructions between CPU cores', 'Files between folders'], correctOption: 0 },
    { id: 'net-http', topic: 'Application protocols', question: 'HTTP is most commonly used for communication between:', options: ['A browser and a web server', 'A CPU and RAM', 'Two database indexes', 'A keyboard and a monitor'], correctOption: 0 },
  ],
  software: [
    { id: 'se-requirements', topic: 'Requirements', question: 'What do functional requirements describe?', options: ['What a system should do', 'The color of every button only', 'The age of the development team', 'The office network layout'], correctOption: 0 },
    { id: 'se-testing', topic: 'Testing', question: 'What is the main purpose of software testing?', options: ['Find defects and check expected behavior', 'Guarantee no future changes', 'Replace all requirements', 'Avoid documentation'], correctOption: 0 },
    { id: 'se-version-control', topic: 'Version control', question: 'What does version control help a team do?', options: ['Track and manage code changes', 'Increase screen brightness', 'Schedule exams', 'Compress database rows'], correctOption: 0 },
    { id: 'se-agile', topic: 'Development process', question: 'Agile development commonly emphasizes:', options: ['Iterative delivery and feedback', 'One final release with no review', 'Avoiding customer input', 'No testing until deployment'], correctOption: 0 },
    { id: 'se-maintenance', topic: 'Maintenance', question: 'Software maintenance includes:', options: ['Fixing defects and adapting software', 'Only writing the initial proposal', 'Deleting all user data', 'Replacing hardware'], correctOption: 0 },
  ],
};

export function getSampleQuestions(subjectName: string): SampleQuestion[] {
  const subject = subjectName.trim().toLowerCase();
  if (subject.includes('dbms') || subject.includes('database')) return banks.dbms;
  if (subject === 'os' || subject.includes('operating')) return banks.operating;
  if (subject === 'cn' || subject.includes('network')) return banks.network;
  if (subject.includes('software')) return banks.software;
  return [];
}
