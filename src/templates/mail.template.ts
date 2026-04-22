export const registerMail = (url: string) => {
  const appName = process.env.APP_NAME || "Japan Travel AI";
  const year = new Date().getFullYear();

  return `
        <div style="margin:0;padding:24px;background:linear-gradient(180deg,#e0f2fe 0%,#f0f9ff 55%,#ffffff 100%);font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:620px;margin:0 auto;">
                <tr>
                    <td style="padding:0;">
                        <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:18px;overflow:hidden;box-shadow:0 14px 34px rgba(2,132,199,0.16);">
                            <div style="padding:24px 28px;background:linear-gradient(135deg,#0ea5e9 0%,#38bdf8 100%);color:#f8fafc;">
                                <p style="margin:0;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;opacity:0.9;">Email Verification</p>
                                <h2 style="margin:8px 0 0;font-size:28px;line-height:1.3;">Welcome to ${appName}</h2>
                            </div>
                            <div style="padding:28px;">
                                <p style="margin:0 0 14px;color:#0f172a;font-size:16px;line-height:1.7;">Thank you for joining us. Please confirm your email address to activate your account and start planning your trip.</p>
                                <div style="margin:26px 0;text-align:center;">
                                    <a href="${url}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#0284c7 0%,#0ea5e9 100%);color:#ffffff;text-decoration:none;border-radius:999px;font-size:15px;font-weight:700;">Verify Email</a>
                                </div>
                                <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:14px 16px;">
                                    <p style="margin:0;color:#0369a1;font-size:13px;line-height:1.6;">For your security, this token expires in <strong>1 hour</strong>.</p>
                                </div>
                            </div>
                            <div style="padding:18px 28px;border-top:1px solid #e2e8f0;background:#f8fbff;">
                                <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;">If you did not create this account, you can safely ignore this email.</p>
                                <p style="margin:8px 0 0;font-size:12px;color:#64748b;">© ${year} ${appName}. All rights reserved.</p>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    `;
};

export const resetPasswordMail = (token: string) => {
  const appName = process.env.APP_NAME || "Japan Travel AI";
  const year = new Date().getFullYear();

  return `
        <div style="margin:0;padding:24px;background:linear-gradient(180deg,#e0f2fe 0%,#f0f9ff 55%,#ffffff 100%);font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:620px;margin:0 auto;">
                <tr>
                    <td style="padding:0;">
                        <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:18px;overflow:hidden;box-shadow:0 14px 34px rgba(2,132,199,0.16);">
                            <div style="padding:24px 28px;background:linear-gradient(135deg,#0ea5e9 0%,#38bdf8 100%);color:#f8fafc;">
                                <p style="margin:0;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;opacity:0.9;">Password Reset</p>
                                <h2 style="margin:8px 0 0;font-size:28px;line-height:1.3;">${appName}</h2>
                            </div>
                            <div style="padding:28px;">
                                <p style="margin:0 0 14px;color:#0f172a;font-size:16px;line-height:1.7;">We received a request to reset your password. Copy the token below and paste it in the reset password form.</p>
                                <div style="margin:26px 0;background:#e0f2fe;border:1px solid #7dd3fc;border-radius:12px;padding:14px 16px;text-align:center;">
                                    <p style="margin:0 0 8px;color:#0369a1;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:700;">Reset Token</p>
                                    <p style="margin:0;color:#0f172a;font-size:16px;line-height:1.6;font-family:'Courier New',Courier,monospace;word-break:break-all;">${token}</p>
                                </div>
                                <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:14px 16px;">
                                    <p style="margin:0;color:#0369a1;font-size:13px;line-height:1.6;">For your security, this link expires in <strong>1 hour</strong>.</p>
                                </div>
                            </div>
                            <div style="padding:18px 28px;border-top:1px solid #e2e8f0;background:#f8fbff;">
                                <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;">If you did not request a password reset, you can safely ignore this email.</p>
                                <p style="margin:8px 0 0;font-size:12px;color:#64748b;">© ${year} ${appName}. All rights reserved.</p>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    `;
};
