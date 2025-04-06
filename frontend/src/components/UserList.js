import React from "react";

const UserList = ({ users = [], isLoading }) => {  // ✅ Ensure users is always an array
    return (
        <div>
            
            {isLoading ? (
                <p>Loading users...</p>
            ) : users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>{user.name} - {user.age} years old<br />
                        📧 {user.email} <br />
                        📞 {user.phone}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserList;
