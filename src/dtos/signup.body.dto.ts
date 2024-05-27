interface signupBodyDTO {
    user_name: string,
    user_phone: string,
    user_birthdate: string,
    user_gender?: 'male' | 'female',
    user_recovery_email?: string,
    user_password: string,

    // EXTRA OPTIONAL CREATED BY SERVER
    // user_local_mail?: string
};

export { signupBodyDTO };