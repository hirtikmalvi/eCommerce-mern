import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [profile, { isLoading }] = useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.userName);
    setEmail(userInfo.email);
  }, [userInfo.userName, userInfo.email]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password do not match");
    } else {
      try {
        const res = await profile({
          _id: userInfo._id,
          userName,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile Updated Successfully");
      } catch (err) {
        if ((err?.data?.message).includes("duplicate"))
          toast.error("Email Already Exists");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[4rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/4 p-5 border border-black">
          <h1 className="text-2xl font-semibold mb-10">
            Update Profile
          </h1>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter name"
                className="form-input p-2.5 border rounded-sm w-full"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-input p-2.5 border rounded-sm w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-input p-2.5 border rounded-sm w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="form-input p-2.5 border rounded-sm w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-500 py-2 px-4 rounded hover:bg-pink-600 text-white"
              >
                Update
              </button>

              <Link
                to="/user-orders"
                className="bg-pink-500 py-2 px-4 rounded hover:bg-pink-700 text-white"
              >
                My Orders
              </Link>
            </div>
            {isLoading && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
