// api/register.js — Vercel Serverless Function
// รับข้อมูลลงทะเบียนนักศึกษา บันทึกลง Vercel Postgres

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    // สร้างตารางถ้ายังไม่มี (ครั้งแรกที่ใช้งาน)
    await sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(150) NOT NULL,
        sid        VARCHAR(20)  NOT NULL UNIQUE,
        faculty    VARCHAR(100) NOT NULL,
        created_at TIMESTAMPTZ  DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      )
    `;

    const { name, sid, faculty } = req.body;

    if (!name || !sid || !faculty) {
      return res.status(400).json({ success: false, error: 'ข้อมูลไม่ครบ' });
    }

    // ถ้า sid ซ้ำ → อัปเดต, ถ้าใหม่ → insert
    await sql`
      INSERT INTO registrations (name, sid, faculty)
      VALUES (${name}, ${sid}, ${faculty})
      ON CONFLICT (sid)
      DO UPDATE SET name = ${name}, faculty = ${faculty}, updated_at = NOW()
    `;

    return res.status(200).json({ success: true, message: 'ลงทะเบียนสำเร็จ' });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาด' });
  }
}
