type ContactEmailProps = {
  name: string;
  email: string;
  message: string;
};

export function ContactEmail({ name, email, message }: ContactEmailProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Contact Message</title>
    </head>
    <body style="margin:0; padding:0; background-color:#e8f5e9; font-family:Arial, sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#e8f5e9; padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(46,125,50,0.15);">

              <!-- Top accent bar -->
              <tr>
                <td style="background-color:#69f0ae; height:4px; font-size:0; line-height:0;">&nbsp;</td>
              </tr>

              <!-- Header -->
              <tr>
                <td style="background-color:#2e7d32; padding:36px 40px; text-align:center;">
                  <h1 style="margin:0 0 8px; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">
                    KASON MOTORS
                  </h1>
                  <p style="margin:0; color:#69f0ae; font-size:12px; letter-spacing:2px; text-transform:uppercase;">
                    New Contact Form Submission
                  </p>
                </td>
              </tr>

              <!-- Info banner -->
              <tr>
                <td style="background-color:#1b5e20; padding:14px 40px;">
                  <p style="margin:0; font-size:13px; color:#69f0ae; font-weight:600; text-align:center; letter-spacing:0.5px;">
                    📬 You have received a new message from your website
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px; background-color:#ffffff;">

                  <!-- Name -->
                  <p style="margin:0 0 6px; font-size:11px; color:#2e7d32; text-transform:uppercase; font-weight:700; letter-spacing:1.5px;">
                    Full Name
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="background-color:#f1f8f1; border-left:4px solid #2e7d32; border-radius:0 6px 6px 0; padding:14px 18px; font-size:15px; color:#1b5e20; font-weight:600;">
                        ${name}
                      </td>
                    </tr>
                  </table>

                  <!-- Email -->
                  <p style="margin:0 0 6px; font-size:11px; color:#2e7d32; text-transform:uppercase; font-weight:700; letter-spacing:1.5px;">
                    Email Address
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="background-color:#f1f8f1; border-left:4px solid #4caf50; border-radius:0 6px 6px 0; padding:14px 18px; font-size:15px; font-weight:600;">
                        <a href="mailto:${email}" style="color:#2e7d32; text-decoration:none;">${email}</a>
                      </td>
                    </tr>
                  </table>

                  <!-- Message -->
                  <p style="margin:0 0 6px; font-size:11px; color:#2e7d32; text-transform:uppercase; font-weight:700; letter-spacing:1.5px;">
                    Message
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                    <tr>
                      <td style="background-color:#f1f8f1; border-left:4px solid #69f0ae; border-radius:0 6px 6px 0; padding:18px 18px; font-size:15px; color:#1b5e20; line-height:1.8;">
                        ${message}
                      </td>
                    </tr>
                  </table>

                  <!-- Reply Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="mailto:${email}?subject=Re: Your enquiry at Kason Motors"
                          style="display:inline-block; background-color:#2e7d32; color:#ffffff; text-decoration:none; padding:14px 44px; border-radius:6px; font-size:14px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
                          Reply to ${name}
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 40px; background-color:#ffffff;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border-top:1px solid #c8e6c9; font-size:0; line-height:0;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px; text-align:center; background-color:#ffffff;">
                  <p style="margin:0 0 4px; font-size:12px; color:#4caf50;">
                    This email was sent automatically from your website contact form.
                  </p>
                  <p style="margin:0; font-size:12px; color:#4caf50;">
                    © ${new Date().getFullYear()} Kason Motors. All rights reserved.
                  </p>
                </td>
              </tr>

              <!-- Bottom accent bar -->
              <tr>
                <td style="background-color:#69f0ae; height:4px; font-size:0; line-height:0;">&nbsp;</td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
}