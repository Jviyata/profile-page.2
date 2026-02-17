import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const profiles = [
  {
    id: 1,
    name: "Arika Gibson",
    role: "Developer",
    year: "2026",
    major: "CS",
    bio: "Full-stack developer passionate about building scalable applications.",
    email: "arika.gibson@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Arika+Gibson&background=6B7A3A&color=fff&size=200",
    status: "active",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Julian Luzadder",
    role: "Designer",
    year: "2025",
    major: "Graphic Design",
    bio: "Creative designer with a passion for user experience and visual aesthetics.",
    email: "julian.luzadder@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Julian+Luzadder&background=2E5090&color=fff&size=200",
    status: "active",
    isFeatured: true,
  },
  {
    id: 3,
    name: "Lyndie Lingg",
    role: "Product Manager",
    year: "2024",
    major: "Business",
    bio: "Strategic thinker focused on creating products that solve real problems.",
    email: "lyndie.lingg@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Lyndie+Lingg&background=C4453C&color=fff&size=200",
    status: "active",
    isFeatured: true,
  },
];

app.get('/api/profiles', (req, res) => {
  res.json(profiles);
});

app.post('/api/profiles', (req, res) => {
  const { name, role, year, major, bio, email, status, isFeatured, avatarImage } = req.body;
  
  // Validation
  if (!name || !role || !year || !major || !bio || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProfile = {
    id: profiles.length + 1,
    name,
    role,
    year,
    major,
    bio,
    email,
    status: status || 'active',
    isFeatured: isFeatured || false,
    avatarUrl: avatarImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6B7A3A&color=fff&size=200`,
  };

  profiles.push(newProfile);
  res.status(201).json(newProfile);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
