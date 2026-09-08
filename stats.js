// api/stats.js — Vercel Serverless Function
// ดึงสถิติภาพรวมสำหรับ Dashboard

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // จำนวนนักศึกษาทั้งหมด
    const totalStudents = await sql`
      SELECT COUNT(*) as total FROM registrations
    `;

    // จำนวนคณะที่เข้าร่วม
    const totalFaculties = await sql`
      SELECT COUNT(DISTINCT faculty) as total FROM registrations
    `;

    // คะแนนเฉลี่ยความพึงพอใจ
    const avgSatisfaction = await sql`
      SELECT ROUND(AVG(total_avg), 2) as avg FROM survey_results
    `;

    // จำนวนนักศึกษาแยกตามคณะ
    const byFaculty = await sql`
      SELECT faculty, COUNT(*) as count
      FROM registrations
      GROUP BY faculty
      ORDER BY count DESC
    `;

    // คะแนนเฉลี่ยแยก awareness vs satisfaction
    const avgBreakdown = await sql`
      SELECT
        ROUND(AVG(awareness_avg), 2)    as awareness,
        ROUND(AVG(satisfaction_avg), 2) as satisfaction
      FROM survey_results
    `;

    return res.status(200).json({
      success:      true,
      students:     parseInt(totalStudents.rows[0].total),
      faculties:    parseInt(totalFaculties.rows[0].total),
      satisfaction: avgSatisfaction.rows[0].avg,
      awareness:    avgBreakdown.rows[0].awareness,
      by_faculty:   byFaculty.rows
    });

  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาด' });
  }
}
