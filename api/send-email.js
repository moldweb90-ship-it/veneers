const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, service } = req.body;

    // Валидация данных
    if (!name || !phone) {
      return res.status(400).json({ error: 'Имя и телефон обязательны' });
    }

    // Настройка транспорта для mail.ru
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true, // true для 465 порта, false для других портов
      auth: {
        user: process.env.EMAIL_USER, // Ваш email от mail.ru
        pass: process.env.EMAIL_PASSWORD, // Ваш пароль приложения от mail.ru
      },
    });

    // Формирование письма
    const mailOptions = {
      from: process.env.EMAIL_USER, // От кого
      to: 'mold.web@mail.ru', // Кому
      subject: `Новая заявка с сайта LIFE DENTAL - ${service || 'Общая консультация'}`,
      html: `
        <h2>Новая заявка с сайта LIFE DENTAL</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
        <p><strong>Услуга:</strong> ${service || 'Общая консультация'}</p>
        <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Chisinau' })}</p>
        <hr>
        <p style="color: #999; font-size: 12px;">Это автоматическое письмо с сайта veneersmd.vercel.app</p>
      `,
      text: `
Новая заявка с сайта LIFE DENTAL

Имя: ${name}
Телефон: ${phone}
Услуга: ${service || 'Общая консультация'}
Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Chisinau' })}
      `,
    };

    // Отправка письма
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Письмо отправлено успешно' });
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    return res.status(500).json({ error: 'Ошибка отправки письма', details: error.message });
  }
}

