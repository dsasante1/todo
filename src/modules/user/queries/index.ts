const createUser = `
    INSERT into users (
        first_name,
        last_name,
        email,
        password
      
    ) VALUES ($/first_name/,$/last_name/,$/email/,$/password/)
`;

const findUserById = `
        SELECT * FROM users WHERE id=$1;
`;

const fetchUserByEmail = `
        SELECT * from users WHERE email = $1
`;

const findUsers = `
        SELECT u.id, first_name, last_name, email, created_at, status, country, phone_number, dob, address, user_name, image_url, gender
        FROM users u 
`;

const fetchUsers = `
        SELECT ui.id, first_name, last_name, email, status, image_url, phone_number, dob, gender, ui.created_at
        FROM users ui
`;

const findUserByUsername = `
        SELECT user_name FROM users WHERE user_name=$1;
`;

const UserQueries = {
  createUser,

  findUsers,
  findUserById,
  fetchUserByEmail,

  fetchUsers,

  findUserByUsername,
};

export default UserQueries;
