interface emailBodyDTO {
    email_sender_id?: number,
    email_recivers: string[],
    email_subject?: string,
    email_text?: string,
    email_links?: string[]

}

export { emailBodyDTO };