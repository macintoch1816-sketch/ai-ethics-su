AI Ethics SU - Supabase + Vercel

ไฟล์หลัก:
- index.html

วิธี Deploy:
1. สร้าง GitHub Repository ใหม่
2. อัปโหลด index.html ไปที่ root ของ Repository
3. เข้า Vercel และเลือก Add New > Project
4. Import Repository จาก GitHub
5. Deploy

เว็บไซต์นี้เชื่อม Supabase Project:
AI Ethics SU
Project URL: https://zdsjshzlcsslanaqbksv.supabase.co

ระบบที่ทำ:
- บันทึกชื่อ-นามสกุล
- บันทึกรหัสนักศึกษา
- บันทึกคณะ
- เก็บวันและเวลาลงทะเบียนใน created_at
- ตรวจสอบรหัสนักศึกษาซ้ำก่อนลงทะเบียน
- จำนวนผู้ลงทะเบียนอัปเดตแบบ Real-time
- ความพึงพอใจอัปเดตจากตาราง evaluations

หมายเหตุ:
ก่อนใช้กับผู้เข้าร่วมวิจัยจริง ควรตรวจสอบนโยบาย RLS ของ Supabase
เพื่อไม่ให้ข้อมูลชื่อและรหัสนักศึกษาถูกเปิดอ่านต่อสาธารณะ
