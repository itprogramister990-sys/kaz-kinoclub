import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${turnstileSecret}&response=${turnstileToken}`,
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyData.success) {
        return NextResponse.json({ message: "Не удалось верифицировать токен" }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a verification token containing user details (expires in 24 hours)
    const jwtSecret = process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_mode_only_123456_do_not_use_in_prod";
    const verificationToken = jwt.sign(
      { name, email, password: hashedPassword },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Get base URL for link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/verify?token=${verificationToken}`;

    // Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || "dummy",
        pass: process.env.SMTP_PASS || "dummy",
      },
    });

    // In dev mode without SMTP, we just log it and simulate success
    if (!process.env.SMTP_HOST) {
      console.log("=== DEV MODE: Email verification link ===");
      console.log(verifyLink);
      console.log("=========================================");
    } else {
      await transporter.sendMail({
        from: '"Kinoklub Support" <noreply@kinoklub.kz>',
        to: email,
        subject: "Подтверждение регистрации на Kinoklub",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d1a; color: #ffffff; padding: 40px; border-radius: 20px;">
            <h1 style="text-align: center; color: #ffffff;">Добро пожаловать в Kino<span style="color: #ff3366;">Klub</span></h1>
            <p style="font-size: 16px; color: #cbd5e1; text-align: center; margin-top: 20px;">
              Спасибо за регистрацию! Пожалуйста, подтвердите ваш email, нажав на кнопку ниже:
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verifyLink}" style="background: linear-gradient(to right, #9333ea, #4f46e5); color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">
                Подтвердить аккаунт
              </a>
            </div>
            <p style="font-size: 12px; color: #64748b; text-align: center;">
              Если вы не регистрировались на сайте Kinoklub, просто проигнорируйте это письмо.<br/>
              Ссылка действительна в течение 24 часов.
            </p>
          </div>
        `
      });
    }

    return NextResponse.json(
      { message: "Письмо с подтверждением отправлено" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
