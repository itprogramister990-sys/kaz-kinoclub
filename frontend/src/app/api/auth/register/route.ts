import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Note: In a real application, you would connect to a database
// e.g. import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, turnstileToken } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Заполните все поля" }, { status: 400 });
    }

    if (!turnstileToken) {
      return NextResponse.json({ message: "Не пройдена проверка на бота" }, { status: 400 });
    }

    // Verify Turnstile Token (mock for dev if no secret is set)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileSecret !== 'mock_secret') {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${turnstileSecret}&response=${turnstileToken}`,
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyData.success) {
        return NextResponse.json({ message: "Не удалось верифицировать токен" }, { status: 400 });
      }
    }

    // In a real app, check if user exists in DB
    // const existingUser = await db.user.findUnique({ where: { email } });
    // if (existingUser) { ... }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    // const user = await db.user.create({
    //   data: { name, email, password: hashedPassword }
    // });

    // Return success
    return NextResponse.json(
      { message: "Регистрация успешна" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
