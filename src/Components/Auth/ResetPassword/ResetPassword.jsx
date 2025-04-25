import { Helmet } from "react-helmet";
import useAuth from "../../Hooks/useAuth";
import { Input } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const emailRef = useRef();
  const { register, formState: { errors } } = useForm();

  // 🔄 Handle password reset request
  const handleResetPassword = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;

    // ❌ Check if email is empty
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    // ❌ Check for valid email format
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      // ✅ Send password reset email via Firebase
      await resetPassword(email);
      toast.success("Reset link sent! Check your inbox.");

      // ✉️ Send follow-up email via EmailJS (currently sent too early – for info only)
      await sendConfirmationEmail(email);

      // ⏳ Wait and then open Gmail
      setTimeout(() => {
        window.location.href = "https://mail.google.com/mail/u/0/?hl=en-GB#inbox";
      }, 500);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  // ✉️ Send confirmation email using EmailJS
  const sendConfirmationEmail = async (email) => {
    try {
      await emailjs.send(
        import.meta.env.VITE_SERVICEID,
        import.meta.env.VITE_TEMPLATECODE,
        {
          user_email: email, // 👈 must match the template variable name in EmailJS
        },
        import.meta.env.VITE_USERID
      );
      console.log("Confirmation email sent.");
    } catch (error) {
      toast.error("Failed to send follow-up email.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 flex min-h-screen justify-center items-center">
      <Helmet>
        <title>Reset Your Password</title>
      </Helmet>

      <div className="w-full mx-auto p-10 shadow-xl rounded-2xl">
        <p className="text-2xl text-center font-extrabold text-[#339179]">Reset Your Password</p>
        
        {/* 🧾 Password reset form */}
        <form onSubmit={handleResetPassword} className="mt-5 mx-auto">
          <div className="sm:w-[200px] md:w-[280px] lg:w-[500px] mx-auto font-bold">
            <Input
              label="Type Your Email"
              placeholder="Type Your Email"
              inputRef={emailRef}
              color="red"
              className="text-[#339179] rounded-lg"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-600 text-sm font-bold">
                This field is required
              </span>
            )}
          </div>

          {/* 🔘 Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="btn w-80 mx-auto ml-4 lg:ml-[450px] rounded-full mt-2 px-4 bg-[#339179] hover:bg-[#2e7f6e] text-white"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
