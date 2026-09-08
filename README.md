# AI Ethics SU — คู่มือ Deploy บน Vercel

## โครงสร้างไฟล์
```
ai-ethics-su/
├── index.html        ← เว็บหลัก (เชื่อม /api อัตโนมัติ)
├── package.json      ← dependencies
├── README.md         ← คู่มือนี้
└── api/
    ├── register.js   ← POST /api/register (บันทึกลงทะเบียน)
    ├── survey.js     ← POST /api/survey   (บันทึกแบบประเมิน)
    └── stats.js      ← GET  /api/stats    (ดึงสถิติ realtime)
```

---

## ขั้นตอน Deploy (ใช้เวลา ~15 นาที)

### 1. สร้าง GitHub Repository
1. ไปที่ https://github.com/new
2. ตั้งชื่อ `ai-ethics-su`
3. กด **Create repository**
4. Upload ไฟล์ทั้งหมดจากโฟลเดอร์นี้ขึ้น GitHub
   - กด **uploading an existing file**
   - ลาก folder `api/` และไฟล์ทั้งหมดขึ้นไป
   - กด **Commit changes**

### 2. เชื่อม Vercel
1. ไปที่ https://vercel.com → **Sign up** (ใช้ GitHub account)
2. กด **Add New Project**
3. เลือก repo `ai-ethics-su` → กด **Import**
4. กด **Deploy** (ไม่ต้องแก้อะไร)
5. รอ ~1 นาที → ได้ URL เช่น `https://ai-ethics-su.vercel.app` ✅

### 3. เพิ่ม Database (Vercel Postgres)
1. เข้า Vercel Dashboard → เลือก project `ai-ethics-su`
2. แท็บ **Storage** → **Create Database**
3. เลือก **Neon Serverless Postgres** → **Continue**
4. ตั้งชื่อ database → **Create**
5. กด **Connect** → Vercel inject `POSTGRES_URL` ให้อัตโนมัติ ✅
6. กด **Redeploy** เพื่อให้ functions เห็น environment variable ใหม่

### 4. ทดสอบ
เปิด browser ไปที่:
```
https://ai-ethics-su.vercel.app/api/stats
```
ถ้าเห็น `{"success":true,"students":0,...}` แสดงว่าทุกอย่างทำงานแล้ว ✅

---

## ข้อมูลที่เก็บใน Database

| ตาราง | ข้อมูล |
|-------|--------|
| `registrations` | ชื่อ, รหัสนักศึกษา, คณะ, วันที่ลงทะเบียน |
| `survey_results` | คะแนนแต่ละข้อ (r1-r6), ค่าเฉลี่ย, ข้อเสนอแนะ |

## ดูข้อมูลทั้งหมด
เข้า Vercel Dashboard → Storage → เปิด Neon Console → Query ได้เลย:
```sql
SELECT * FROM registrations ORDER BY created_at DESC;
SELECT * FROM survey_results ORDER BY created_at DESC;
```
