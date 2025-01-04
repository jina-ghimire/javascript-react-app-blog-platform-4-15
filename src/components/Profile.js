import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import '../styles/Profile.css';

const Profile = ({ user, setUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: user });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Update user data in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, ...data } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Update the current user in state and localStorage
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    alert("Profile updated successfully.");
    navigate("/posts");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
      <h1>Edit Profile</h1>
      <div>
        <label>Username</label>
        <input
          {...register("username", { required: "Username is required." })}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
      </div>
      <div>
        <label>Email</label>
        <input
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address."
            }
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>
      <div>
        <label>New Password</label>
        <input
          type="password"
          {...register("password", {
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters."
            },
            maxLength: {
              value: 40,
              message: "Password must be no more than 40 characters."
            }
          })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>
      <div>
        <label>Avatar URL</label>
        <input
          {...register("avatar", {
            required: "Avatar URL is required.",
            pattern: {
              value: /(https?:\/\/.*\.(?:png|jpg|jpeg))/i,
              message: "Invalid image URL."
            }
          })}
        />
        {errors.avatar && <p className="error">{errors.avatar.message}</p>}
      </div>
      <button type="submit" className="primary">Save Changes</button>
    </form>
  );
};

export default Profile;