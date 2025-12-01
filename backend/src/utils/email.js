const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// 创建邮件模板
const templates = {
  verifyEmail: {
    subject: '验证您的邮箱 - 宇宙探索',
    template: 'verify-email'
  },
  passwordChanged: {
    subject: '密码已修改 - 宇宙探索',
    template: 'password-changed'
  },
  resetPassword: {
    subject: '重置您的密码 - 宇宙探索',
    template: 'reset-password'
  },
  welcome: {
    subject: '欢迎加入宇宙探索！',
    template: 'welcome'
  }
};

// 创建邮件传输器
const createTransporter = async () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    // 使用Gmail OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );
    
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });
    
    const accessToken = await oauth2Client.getAccessToken();
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'smtp') {
    // 使用SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // 开发环境：使用Ethereal测试邮箱
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
};

// 发送邮件
const sendEmail = async ({ email, subject, template, context }) => {
  try {
    // 如果是开发环境且不是强制发送，则不发送真实邮件
    if (process.env.NODE_ENV === 'development' && process.env.FORCE_SEND_EMAIL !== 'true') {
      console.log('📧 开发环境 - 模拟发送邮件:');
      console.log('收件人:', email);
      console.log('主题:', subject);
      console.log('内容:', context);
      return { success: true, message: '开发环境模拟发送成功' };
    }
    
    const transporter = await createTransporter();
    
    // 加载HTML模板
    let html;
    try {
      const templatePath = path.join(__dirname, '../templates/email', `${template}.html`);
      html = await fs.readFile(templatePath, 'utf-8');
      
      // 替换模板变量
      Object.keys(context).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, context[key]);
      });
    } catch (error) {
      // 如果模板不存在，使用默认模板
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4a9de3, #7abcfa); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .btn { display: inline-block; background: #4a9de3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white; margin: 0;">🌌 宇宙探索</h1>
            </div>
            <div class="content">
              <h2>${subject}</h2>
              <p>亲爱的 ${context.username || '用户'}，</p>
              ${context.message || ''}
              ${context.verificationUrl ? `<p><a href="${context.verificationUrl}" class="btn">点击验证</a></p>` : ''}
              ${context.resetUrl ? `<p><a href="${context.resetUrl}" class="btn">重置密码</a></p>` : ''}
              <p>如果您没有请求此操作，请忽略此邮件。</p>
              <p>祝您探索愉快！<br>宇宙探索团队</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} 宇宙探索. 保留所有权利.</p>
              <p>这是一封自动生成的邮件，请勿回复。</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }
    
    // 邮件选项
    const mailOptions = {
      from: `"宇宙探索" <${process.env.EMAIL_FROM || 'noreply@space-exploration.com'}>`,
      to: email,
      subject: subject,
      html: html
    };
    
    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    
    // 如果是Ethereal邮箱，打印预览链接
    if (process.env.NODE_ENV === 'development' && process.env.EMAIL_SERVICE !== 'production') {
      console.log('📧 邮件预览:', nodemailer.getTestMessageUrl(info));
    }
    
    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
    
  } catch (error) {
    console.error('发送邮件错误:', error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;