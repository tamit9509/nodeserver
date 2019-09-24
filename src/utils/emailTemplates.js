module.exports = {

  WELCOME_VERIFICATION_EMAIL: `<p>Hello<span style="color: #3366ff;"> <strong> {{username}}
  </strong></span>,</p><p>Verify your account for HowYou by clicking on the below link<span style="color: #3366ff;"><strong></p><a href="{{verifyLink}}" target="_blank">Verify My Account</a><p>Regards,<br>
  Team HowYou </p>`,
  FORGOT_PASSWORD_EMAIL: `<p>Hello<span style="color: #3366ff;"> <strong>{{fullName}}</strong></span>,</p><p>Reset you password by clicking on the link<span style="color: #3366ff;"><strong></p><a href={{resetPasswordLink}} target="_blank">Reset your password</a><p>Regards,<br>
  Team ChicMic</p>`,
  FORGOT_PASSWORD_EMAIL_UPDATED: `<p>Hello<span style="color: #3366ff;"> <strong>{{fullName}}</strong></span>,</p><p>Your verification code for change password request is <span style="color: #3366ff;"><strong>{{code}}`
}