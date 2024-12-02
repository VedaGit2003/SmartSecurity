import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailTrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })
        if (response) {
            console.log("Email sent successfully", response)
        }


    } catch (error) {
        console.error("Error sending verification", error);

        throw new Error(`Error sending verification email: ${error}`);
    }

}


//welcome mail 
export const sendWelcomeMail = async (email, name) => {
    const recipient = [{ email }]
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "f260cfdf-2ca3-47b4-b87b-70ea59952dc0",
            template_variables: {
                "company_info_name": "Smart Security",
                "name": name
            }
        })
        if (response) {
            console.log("Welcome mail send successfully", response)
        }
    } catch (error) {
        console.log('There is an error while sending verification code', error)
        throw new Error(`Error sending verification email: ${error}`);
    }
}

//password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }]

    try {
     const response=await mailTrapClient.send({
        from: sender,
        to: recipient,
        subject: "Reset your password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        category: "Password Reset",
     })
    } catch (error) {
        console.error(`Error sending password reset email`, error);

        throw new Error(`Error sending password reset email: ${error}`);
    }
}


//reset password successfull email
export const sendResetSuccessfullEmail=async(email)=>{
   const recipient=[{email}]
    try{
        const response = await mailTrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});
        console.log("Password reset email sent successfully", response);
    }catch (error) {
        console.error(`Error sending password reset successfull email`, error);

        throw new Error(`Error sending password reset successfull email: ${error}`);
    }
}