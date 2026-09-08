// api/survey.js — Vercel Serverless Function
// รับผลแบบประเมินความพึงพอใจ บันทึกลง Vercel Postgres

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    // สร้างตารางถ้ายังไม่มี
    await sql`
      CREATE TABLE IF NOT EXISTS survey_results (
        id               SERIAL PRIMARY KEY,
        sid              VARCHAR(20)   NOT NULL,
        faculty          VARCHAR(100)  NOT NULL,
        r1               SMALLINT      NOT NULL,
        r2               SMALLINT      NOT NULL,
        r3               SMALLINT      NOT NULL,
        r4               SMALLINT      NOT NULL,
        r5               SMALLINT      NOT NULL,
        r6               SMALLINT      NOT NULL,
        awareness_avg    NUMERIC(4,2),
        satisfaction_avg NUMERIC(4,2),
        total_avg        NUMERIC(4,2),
        comment          TEXT,
        created_at       TIMESTAMPTZ   DEFAULT NOW()
      )
    `;

    const { sid, faculty, ratings, comment } = req.body;

    if (!sid || !faculty || !ratings) {
      return res.status(400).json({ success: false, error: 'ข้อมูลไม่ครบ' });
    }

    const { r1, r2, r3, r4, r5, r6 } = ratings;
    const awareness_avg    = +((r1 + r2 + r3) / 3).toFixed(2);
    const satisfaction_avg = +((r4 + r5 + r6) / 3).toFixed(2);
    const total_avg        = +((r1+r2+r3+r4+r5+r6) / 6).toFixed(2);

    await sql`
      INSERT INTO survey_results
        (sid, faculty, r1, r2, r3, r4, r5, r6,
         awareness_avg, satisfaction_avg, total_avg, comment)
      VALUES
        (${sid}, ${faculty}, ${r1}, ${r2}, ${r3}, ${r4}, ${r5}, ${r6},
         ${awareness_avg}, ${satisfaction_avg}, ${total_avg}, ${comment || ''})
    `;

    return res.status(200).json({
      success: true,
      message: 'บันทึกแบบประเมินสำเร็จ',
      avg: total_avg
    });

  } catch (err) {
    console.error('Survey error:', err);
    return res.status(500).json({ success: false, error: 'เกิดข้อผิดพลาด' });
  }
}
