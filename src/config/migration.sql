
-- STEP 1: Creating User
CREATE USER <process.env.DB_USER> WITH ENCRYPTED PASSWORD '<process.env.DB_PASSWORD>';
-- STEP 2: Creating Db
CREATE DATABASE <process.env.DB_DBNAME> WITH OWNER <process.env.DB_USER> ENCODING='UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8';



-- STEP 3: Creating Local Users Table
CREATE TABLE IF NOT EXISTS "local_users" (
    local_user_id BIGSERIAL PRIMARY KEY,
    local_user_name VARCHAR(50) NOT NULL UNIQUE,
    local_user_phone VARCHAR(20) NOT NULL,
    local_user_birth_date DATE NOT NULL,
    local_user_recovery_email VARCHAR(100) DEFAULT 'Recovery Email Not Set',
    local_user_password VARCHAR(255) NOT NULL,
    local_user_gender VARCHAR(50) DEFAULT 'Prefer To Not Say',
    local_user_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    local_user_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- STEP 4: Creating Social Users Table
CREATE TABLE IF NOT EXISTS "social_users" (
    social_user_id BIGSERIAL PRIMARY KEY,
    social_user_provider_data JSONB NOT NULL,
    social_user_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    social_user_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- STEP 5: Creating Mail Addrs For All Users Table
CREATE TABLE IF NOT EXISTS "emails_address" (
    email_addr_id BIGSERIAL PRIMARY KEY,
    email_addr_name VARCHAR(100) NOT NULL UNIQUE,
    email_addr_local_user INT DEFAULT NULL,
    email_addr_social_user INT DEFAULT NULL,

    FOREIGN KEY (email_addr_local_user) REFERENCES local_users(local_user_id) ON DELETE CASCADE,
    FOREIGN KEY (email_addr_social_user) REFERENCES social_users(social_user_id) ON DELETE CASCADE,

    email_addr_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_addr_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- STEP 6: Creating Emails Table
CREATE TABLE IF NOT EXISTS "emails" (
    email_id BIGSERIAL PRIMARY KEY,
    email_sender_id INT NOT NULL,
    email_recivers VARCHAR[] NOT NULL,
    email_subject TEXT DEFAULT NULL,
    email_text TEXT DEFAULT NULL,
    email_links VARCHAR[] DEFAULT NULL,
    email_status_edited BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (email_sender_id) REFERENCES emails_address(email_addr_id) ON DELETE CASCADE,

    email_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- STEP 7: Creating Emails Labels And Client Routing Mail Paths

-- SENT TABLE LABEL
CREATE TABLE IF NOT EXISTS "emails_sent" (
    email_sent_id BIGSERIAL PRIMARY KEY,
    email_id INT NOT NULL,
    email_sent_by_id INT NOT NULL,

    FOREIGN KEY (email_id) REFERENCES emails(email_id) ON DELETE CASCADE,
    FOREIGN KEY (email_sent_by_id) REFERENCES emails_address(email_addr_id) ON DELETE CASCADE,

    email_sent_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_sent_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INBOX TABLE LABEL
CREATE TABLE IF NOT EXISTS "emails_inbox" (
    email_inbox_id BIGSERIAL PRIMARY KEY,
    email_id INT NOT NULL,
    email_recived_by_id INT NOT NULL,

    FOREIGN KEY (email_id) REFERENCES emails(email_id) ON DELETE CASCADE,
    FOREIGN KEY (email_recived_by_id) REFERENCES emails_address(email_addr_id) ON DELETE CASCADE,

    email_sent_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_sent_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- STARRED TABLE LABEL
CREATE TABLE IF NOT EXISTS "emails_starred" (
    email_starred_id BIGSERIAL PRIMARY KEY,
    email_id INT NOT NULL,
    email_starred_by_id INT NOT NULL,

    FOREIGN KEY (email_id) REFERENCES emails(email_id) ON DELETE CASCADE,
    FOREIGN KEY (email_starred_by_id) REFERENCES emails_address(email_addr_id) ON DELETE CASCADE,

    email_starred_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_starred_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ARCHIVED TABLE LABEL
CREATE TABLE IF NOT EXISTS "emails_archived" (
    email_archived_id BIGSERIAL PRIMARY KEY,
    email_id INT NOT NULL,
    email_archived_by_id INT NOT NULL,
    email_original_labels VARCHAR[] NOT NULL,

    FOREIGN KEY (email_id) REFERENCES emails(email_id) ON DELETE CASCADE,
    FOREIGN KEY (email_archived_by_id) REFERENCES emails_address(email_addr_id) ON DELETE CASCADE,

    email_archived_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_archived_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SPAM TABLE LABEL:
CREATE TABLE IF NOT EXISTS "emails_spammed" (
    email_spammed_id BIGSERIAL PRIMARY KEY,
    email_id INT NOT NULL,
    email_spammed_by_id INT NOT NULL,
    email_original_labels VARCHAR[] NOT NULL,

    FOREIGN KEY (email_id) REFERENCES emails(email_id) ON DELETE CASCADE,
    FOREIGN KEY (email_spammed_by_id) REFERENCES emails_address(email_addr_id) ON DELETE CASCADE,

    email_spammed_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_spammed_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRASH TABLE LABEL:
CREATE TABLE IF NOT EXISTS "emails_trashed" (
    email_trashed_id BIGSERIAL PRIMARY KEY,
    email_id INT NOT NULL,
    email_trashed_by_id INT NOT NULL,

    FOREIGN KEY (email_id) REFERENCES emails(email_id) ON DELETE CASCADE,
    FOREIGN KEY (email_trashed_by_id) REFERENCES emails_address(email_addr_id) ON DELETE CASCADE,

    email_trashed_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_trashed_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
