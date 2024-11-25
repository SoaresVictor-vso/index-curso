const fs = require('fs');
const http = require('http');
const crypto = require('crypto');

const FILE_PATH = './data.json';
const SECRET_KEY = "your-secure-secret";

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify({ users: [], courses: [] }, null, 2));
}

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(JSON.parse(body)));
    req.on('error', reject);
  });
};

const readData = () => JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
const writeData = (data) => fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

const hashPassword = (password) =>
  crypto.createHash('sha256').update(password).digest('hex');

// JWT-like implementation
const createToken = (username) => {
  const payload = { username, exp: Date.now() + 3600000 }; // 1-hour expiration
  const token = `${Buffer.from(JSON.stringify(payload)).toString('base64')}.${crypto
    .createHmac('sha256', SECRET_KEY)
    .update(username)
    .digest('hex')}`;
  return token;
};

const verifyToken = (token) => {
  const [payloadBase64, signature] = token.split('.');
  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload.username)
    .digest('hex');
  if (expectedSignature !== signature || payload.exp < Date.now()) return null;
  return payload.username;
};

// Server
const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  const path = urlParts[0];

  const data = readData();

  // User Registration
  if (path === '/register' && req.method === 'POST') {
    const { username, password } = await parseBody(req);
    if (data.users.find((user) => user.username === username)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'User already exists' }));
    }
    data.users.push({ username, password: hashPassword(password) });
    writeData(data);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User registered successfully' }));
  }

  // User Login
  if (path === '/login' && req.method === 'POST') {
    const { username, password } = await parseBody(req);
    const user = data.users.find((u) => u.username === username);
    if (!user || user.password !== hashPassword(password)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid credentials' }));
    }
    const token = createToken(username);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ token }));
  }

  // Middleware for token verification
  const protectedRoutes = ['/courses'];
  if (protectedRoutes.includes(path) && req.method !== 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Authorization required' }));
    }
    const token = authHeader.split(' ')[1];
    const username = verifyToken(token);
    if (!username) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid or expired token' }));
    }
  }

  // Course CRUD
  if (path === '/courses') {
    if (req.method === 'GET') {
      // Fetch all courses
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data.courses));
    }

    if (req.method === 'POST') {
      // Add a new course
      const course = await parseBody(req);
      if (!course.nome || !course.descrição || !course.url) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing required fields' }));
      }
      course.id = crypto.randomUUID();
      data.courses.push(course);
      writeData(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Course added successfully' }));
    }

    if (req.method === 'PUT') {
      // Update a course
      const updatedCourse = await parseBody(req);
      const courseIndex = data.courses.findIndex((c) => c.id === updatedCourse.id);
      if (courseIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Course not found' }));
      }
      data.courses[courseIndex] = { ...data.courses[courseIndex], ...updatedCourse };
      writeData(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Course updated successfully' }));
    }

    if (req.method === 'DELETE') {
      // Delete a course
      const { id } = await parseBody(req);
      const courseIndex = data.courses.findIndex((c) => c.id === id);
      if (courseIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Course not found' }));
      }
      data.courses.splice(courseIndex, 1);
      writeData(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Course deleted successfully' }));
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3000');
});