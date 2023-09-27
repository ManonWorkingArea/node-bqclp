import storageManager from '@/plugins/storage';
import { emailTemplate } from './email/emailTemplate.js';
import CryptoJS from 'crypto-js';

export async function sendEmail(data, templateType = '') {
  const endpoint = 'https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-34d16f42-4718-42b0-814e-08d23fecd2ce/default/email';
  const session = storageManager.get('session');
  const configs = storageManager.get('configs');

  let email_from_email, email_from_name, email_url, email_key, email_provider;

  if (session.interface === 'frontend') {
    ({ email_from_email, email_from_name, email_url, email_key, email_provider } = configs);
  } else {
    ({ email_from_email, email_from_name, email_url, email_key, email_provider } = session.current);
  }

  const { email, name, subject, body } = data;

  try {
    
    let emailBody, emailSubject;

    if (templateType === 'welcome') {
      ({ emailBody, emailSubject } = getWelcomeTemplate(data));
    } else if (templateType === 'reset-password') {
      ({ emailBody, emailSubject } = await getResetPasswordTemplate(data));
    }else if (templateType === 'change-password') {
      ({ emailBody, emailSubject } = await getChangePasswordTemplate(data));
    } else {
      emailBody = body;
      emailSubject = subject;
    }

    emailBody = emailTemplate.replace('{{ content }}', emailBody).replace('{{ subject }}', emailSubject).replace('{{ provider }}', email_provider);

    const emailData = await recordEmailData(name, email, emailSubject, emailBody);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_email: email_from_email,
        from_name: email_from_name,
        url: email_url,
        key: email_key,
        provider: email_provider,
        body: emailBody,
        to_email: email,
        to_name: name,
        subject: emailSubject,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      if (responseData.status === 200) {
        console.log(responseData.message);
        await updateEmailStatus(emailData._id, 'confirm');
        return responseData;
      } else {
        console.log('Failed to send email');
        const errorMessage = responseData.message || 'Failed to send email';
        await updateEmailStatus(emailData._id, 'fail', errorMessage);
        return errorMessage;
      }
    } else {
      console.log('Failed to send email');
      const errorResponseData = await response.json();
      const errorMessage = errorResponseData.message || 'Failed to send email';
      await updateEmailStatus(emailData._id, 'fail', errorMessage);
      return errorMessage;
    }      
  } catch (error) {
    console.error('Error sending email:', error);
    return error.message;
  }
}

async function recordEmailData(name, email, subject, body) {
  try {
    const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/message/", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        data: {
          name: name,
          email: email,
          subject: subject,
          body: body,
          status: 'submit'
        },
        options: {
          fieldType: [],
          uniqueFields: []
        }
      })
    });

    if (resAPI.status === 200) {
      const responseData = await resAPI.json();
      console.log('Email data recorded successfully');
      return responseData;
    } else {
      return 'Failed to record email data';
    }
  } catch (error) {
    console.error('Error recording email data:', error);
    return error.message;
  }
}

async function updateEmailStatus(id, status, error = '') {
  try {
    const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/message/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        data: {
          status: status,
          error: error
        }
      })
    });

    if (resAPI.status === 200) {
      console.log('Email status updated successfully');
    } else {
      return 'Failed to update email status';
    }
  } catch (error) {
    console.error('Error updating email status:', error);
    return error.message;
  }
}

function getWelcomeTemplate() {
  const emailBody = 'Welcome to our website!';
  const emailSubject = 'Welcome Email';

  return { emailBody, emailSubject };
}

function getChangePasswordTemplate() {
  const emailBody = `
  <p>สวัสดีค่ะ,</p>
  <p>ขอแจ้งให้ทราบว่าบัญชีของคุณได้รับการเปลี่ยนแปลงรหัสผ่านเรียบร้อยแล้วค่ะ</p>
  <p>หากคุณไม่ได้ดำเนินการเปลี่ยนรหัสผ่านนี้ กรุณาติดต่อทีมงานเพื่อรายงานให้ทราบค่ะ</p></br></br>
  <p>ขอบคุณค่ะ</p>
  `;
  const emailSubject = 'แจ้งเตือน: บัญชีของคุณได้รับการเปลี่ยนรหัสผ่าน';
  return { emailBody, emailSubject };
}


async function getResetPasswordTemplate(data) {
  try {
    const resAPILogin = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/user/query", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'find',
        args: [
          {
            $and: [
              { email: data.email }
            ]
          }
        ]
      })
    });

    const loginData = await resAPILogin.json();

    if (loginData.length > 0) {
      const newPassword = generatePassword(6);
      const salt = CryptoJS.lib.WordArray.random(16);
      const hash = CryptoJS.SHA256(newPassword + salt).toString();
      
      try {
        const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/user/${loginData[0]._id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            data: {
              password: hash,
              salt: salt.toString(),
              req_reset: true
            }
          })
        });
    
        if (resAPI.status === 200) {
          console.log('Email status updated successfully');
        } else {
          return 'Failed to update email status';
        }
      } catch (error) {
        console.error('Error updating email status:', error);
        return error.message;
      }

      const emailSubject = 'แจ้งเตือน: รีเซ็ตรหัสผ่าน';
      const emailBody = `
        <p>สวัสดีค่ะ,</p>
        <p>ขอแจ้งให้ทราบว่าบัญชีของคุณได้รับการเปลี่ยนแปลงรหัสผ่านเรียบร้อยแล้วค่ะ</p>
        <p>รหัสผ่านใหม่ของคุณคือ: <strong>${newPassword}</strong></p>
        <p>โปรดจำรหัสผ่านใหม่นี้ไว้เพื่อเข้าสู่ระบบในครั้งถัดไปค่ะ</p>
        <p>หากคุณไม่ได้ดำเนินการเปลี่ยนรหัสผ่านนี้ กรุณาติดต่อทีมงานเพื่อรายงานให้ทราบค่ะ</p></br></br>
        <p>ขอบคุณค่ะ</p>
      `;
      return { emailBody, emailSubject };
    } else {
      console.log("No User");
      return 'User not found';
    }
  } catch (error) {
    console.error('Error retrieving user information:', error);
    return error.message;
  }
}


function generatePassword(length) {
  const characters = '0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
