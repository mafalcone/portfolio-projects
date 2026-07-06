import User from '../models/User.js';
import Refresh from '../models/RefreshToken.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 128;
}

function signAccess(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

function signRefresh(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!email || !isValidPassword(password)) {
      return res.status(400).json({ error: 'Invalid registration data' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User exists' });

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ email, password: hashed });

    return res.status(201).json({ message: 'Registered' });
  } catch (error) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const access = signAccess(user._id);
    const refresh = signRefresh(user._id);

    await Refresh.deleteMany({ userId: user._id });
    await Refresh.create({
      userId: user._id,
      tokenHash: hashToken(refresh),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.json({ accessToken: access, refreshToken: refresh });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
}

export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh not valid' });

    const hash = hashToken(refreshToken);
    const stored = await Refresh.findOne({ tokenHash: hash });
    if (!stored || stored.expires < new Date()) {
      return res.status(401).json({ error: 'Refresh not valid' });
    }

    const access = signAccess(stored.userId);
    return res.json({ accessToken: access });
  } catch (error) {
    return res.status(500).json({ error: 'Refresh failed' });
  }
}

export async function logout(req, res) {
  try {
    await Refresh.deleteMany({ userId: req.userId });
    return res.json({ message: 'Logged out' });
  } catch (error) {
    return res.status(500).json({ error: 'Logout failed' });
  }
}
