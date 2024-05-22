const createUser = `
    INSERT into user_info (
        id,
        first_name,
        last_name,
        user_name,
        email,
        password,
        salt,
        country,
        phone_number,
        referral_code,
        user_otp
    ) VALUES ($/id/,$/first_name/,$/last_name/,$/user_name/,$/email/,$/password/,$/salt/,$/country/,$/phone_number/,$/referral_code/,$/user_otp/)
`;

const findUserById = `
        SELECT * FROM user_info WHERE id=$1;
`;

const fetchUserByEmail = `
        SELECT * from user_info WHERE email = $1
`;
const fetchUsersByLevel = `SELECT id, current_user_level FROM user_info WHERE current_user_level = $1`;

const updateVerifiedToTrue = `
      UPDATE user_info SET is_verified = True
      WHERE email=$1 RETURNING email
`;

const addPin = `
      UPDATE user_info SET pin=$2
      WHERE email=$1 RETURNING id
`;

const updateUserProfile = `
        UPDATE user_info SET first_name=$/first_name/, last_name=$/last_name/, user_name=$/user_name/,
        phone_number=$/phone_number/, dob=$/dob/, gender=$/gender/, address=$/address/, country=$/country/, image_url=$/image_url/, updated_at=NOW()
        WHERE id=$/id/ 
        RETURNING id, first_name, last_name, user_name, phone_number, dob, gender, email, address, country, image_url
`;

const findUsers = `
        SELECT u.id, first_name, last_name, email, created_at, status, country, phone_number, dob, address, user_name, image_url, gender
        FROM user_info u 
`;

const addUserOtp = `
        UPDATE user_info SET user_otp = $1
        WHERE email = $2 RETURNING id, user_otp
`;

const resetUserPassword = `
        UPDATE 
            user_info
        SET
            password = $1,
            salt = $2
        WHERE 
            email = $3;
`;

const updateUserOtp = `
      UPDATE user_info SET user_otp=null
      WHERE email=$1
      RETURNING id, user_otp
`;

const updateHasPinToTrue = `
        UPDATE user_info SET has_pin = True
        WHERE email=$1 RETURNING email
`;

const completeUserProfile = `
        UPDATE user_info SET image_url=$/image_url/,
        phone_number=$/phone_number/, dob=$/dob/, address=$/address/, gender=$/gender/, updated_at=NOW()
        WHERE id=$/id/ 
        RETURNING id, first_name, last_name, phone_number, dob, address, gender, email
`;

const getAccountVerification = `
        SELECT id, profile_completed, is_bvn_verified, is_id_verified
        FROM user_info 
        WHERE id=$1
`;

const updateIsIdVerified = `
        UPDATE user_info SET is_id_verified = True
        WHERE id=$1
        RETURNING id, is_id_verified
`;

const updateIsBvnVerified = `
        UPDATE user_info SET is_bvn_verified = True
        WHERE id=$1
        RETURNING id, is_bvn_verified
`;

const updateBiometricEnabled = `
        UPDATE user_info SET biometric_enabled = True
        WHERE id=$1
        RETURNING id, biometric_enabled
`;

const fetchUsers = `
        SELECT ui.id, first_name, last_name, email, status, image_url, phone_number, dob, gender, ui.created_at
        FROM user_info ui
`;

const deleteUser = `
        DELETE FROM user_info
        WHERE id = $1
        RETURNING id, email, first_name, last_name, status
`;

const activateUser = `
        UPDATE user_info SET status = 'active'
        WHERE id=$1
        RETURNING id, status        
`;

const deactivateUser = `
        UPDATE user_info SET status = 'deactivated'
        WHERE id=$1
        RETURNING id, status        
`;

const updateProfileCompletedTrue = `
        UPDATE user_info SET profile_completed = True
        WHERE id=$1
        RETURNING id, profile_completed
`;

const updateUserPin = `
        UPDATE user_info SET pin = $2
        WHERE email=$1
        RETURNING id, profile_completed
`;

const disableUser = `
        UPDATE user_info SET status = 'disabled'
        WHERE id=$1
        RETURNING id, status        
`;

const findUserByUsername = `
        SELECT user_name FROM user_info WHERE user_name=$1;
`;

const addBank = `
        INSERT into bank_info (
                id,
                user_id,
                bank_name,
                account_name,
                account_number,
                bank_code
        ) VALUES ($/id/,$/user_id/,$/bank_name/,$/account_name/,$/account_number/,$/bank_code/)
        RETURNING id, user_id, bank_name, account_name, account_number, bank_code, created_at
`;

const editBankInfo = `
        UPDATE bank_info SET counter_party_id = $2 WHERE user_id = $1
`;

const fetchBanks = `
        SELECT * FROM bank_info
        WHERE user_id = $1
`;

const deleteBank = `
        DELETE  FROM bank_info
        WHERE id = $1
        RETURNING id, user_id, bank_name, account_name, account_number
`;

const updateTwoFactorSecret = `
        UPDATE user_info SET two_factor_secret=$1
        WHERE id = $2
`;

const getTwoFactorSecret = `
        SELECT two_factor_secret FROM user_info
        WHERE id = $1
`;

const enableTwoFactor = `
        UPDATE user_info SET two_factor_verified=true
        WHERE id = $1
`;

const disableTwoFactor = `
        UPDATE user_info SET two_factor_verified=false
        WHERE id = $1
        RETURNING two_factor_verified
`;

const getEnableTwoFactor = `
        SELECT id, two_factor_verified FROM user_info
        WHERE id = $1
`;

const fetchUserTransactionsPagination = `
       SELECT id, wallet_id, user_id, amount, status, transaction_date, transaction_type, status FROM transaction_info
`;

const fetchSingleTransaction = `
SELECT 
    t.id AS transaction_id,
    t.wallet_id,
    t.user_id,
    t.amount AS transaction_amount,
    t.status AS transaction_status,
    t.transaction_date,
    t.transaction_type,
    c.id AS card_id,
    c.category AS card_category,
    c.sub_category AS card_sub_category,
    c.user_id AS card_user_id,
    c.amount AS card_amount,
    c.country AS card_country,
    c.type AS card_type,
    c.quantity AS card_quantity,
    c.image_url AS card_image_url,
    c.comment AS card_comment,
    c.created_at AS card_created_at,
    c.updated_at AS card_updated_at
FROM 
    transaction_info t
LEFT JOIN 
  card_info c ON c.id = t.card_id
WHERE 
    t.id = $1
`;

const currentUserTransactionsAmount = `SELECT total_transaction FROM user_info WHERE id = $1`;

// update total user level transactions
const updateTransactionAmount = `UPDATE user_info SET total_transaction = total_transaction + $2 WHERE id = $1 RETURNING *`;

// check boolean to see if the user has reached a new status
const getUserLevelStatus = `SELECT new_level FROM user_info WHERE id = $1`;

const fetchUserLevelInfo = `SELECT id, new_level, current_user_level, total_transaction FROM user_info WHERE id = $1`;

// boolean to indicate that the user has reached a new level
const changeUserLevelStatus = `UPDATE user_info SET new_level = $2 WHERE id = $1 RETURNING new_level, id`;

const changeUserLevel = `UPDATE user_info SET current_user_level = $2 WHERE id = $1`;

const changeUserLevelAndStatus = `UPDATE user_info
 SET current_user_level = $2,
 new_level = $3
  WHERE id = $1`;

const fetchTransactionSummary = `SELECT * from transaction_info WHERE id = $1`;

const fetchCardInfoTransactionSummary = `
SELECT 
    t.id AS transaction_id,
    t.wallet_id,
    t.user_id,
    t.card_id,
    t.amount AS transaction_amount,
    t.status AS transaction_status,
    t.transaction_date,
    t.transaction_type,
    c.id AS card_id,
    c.category AS card_category,
    c.sub_category AS card_sub_category,
    c.user_id AS card_user_id,
    c.amount AS card_amount,
    c.country AS card_country,
    c.type AS card_type,
    c.quantity AS card_quantity,
    c.image_url AS card_image_url,
    c.comment AS card_comment,
    c.created_at AS card_created_at,
    c.updated_at AS card_updated_at
FROM 
    transaction_info t
LEFT JOIN card_info c 
ON c.id = t.card_id
WHERE 
   t.id = $1
`;

const getUserEmailByLevel = `SELECT email, first_name FROM user_info WHERE current_user_level = $1`;
const getAllUsersEmails = `SELECT email, first_name from user_info`;
const getNotificationToken = `
                        SELECT first_name, notify_android_token, notify_web_token,
                         notify_iphone_token from user_info;`;
const getEmailsById = `SELECT email, first_name from user_info WHERE id=$1`;

const getNotifyTokenByLevel = `SELECT 
                                first_name, notify_android_token,
                                notify_web_token, notify_iphone_token 
                                from user_info
                        WHERE current_user_level=$1`;

const getNotifyTokenById = `
                        SELECT first_name, notify_android_token,
                                notify_web_token, notify_iphone_token 
                                from user_info
                        WHERE id=$1`;

const UserQueries = {
  createUser,
  updateUserProfile,
  findUsers,
  findUserById,
  fetchUserByEmail,
  updateVerifiedToTrue,
  addPin,
  addUserOtp,
  resetUserPassword,
  updateUserOtp,
  updateHasPinToTrue,
  completeUserProfile,
  getAccountVerification,
  updateIsIdVerified,
  updateIsBvnVerified,
  updateBiometricEnabled,
  fetchUsers,
  deleteUser,
  activateUser,
  deactivateUser,
  updateProfileCompletedTrue,
  updateUserPin,
  disableUser,
  findUserByUsername,
  addBank,
  fetchBanks,
  deleteBank,
  updateTwoFactorSecret,
  getTwoFactorSecret,
  enableTwoFactor,
  disableTwoFactor,
  getEnableTwoFactor,
  editBankInfo,
  fetchUserTransactionsPagination,
  fetchSingleTransaction,
  currentUserTransactionsAmount,
  updateTransactionAmount,
  getUserLevelStatus,
  fetchUserLevelInfo,
  changeUserLevelStatus,
  changeUserLevel,
  changeUserLevelAndStatus,
  fetchUsersByLevel,
  fetchTransactionSummary,
  fetchCardInfoTransactionSummary,
  getUserEmailByLevel,
  getAllUsersEmails,
  getNotificationToken,
  getEmailsById,
  getNotifyTokenByLevel,
  getNotifyTokenById,
};

export default UserQueries;
