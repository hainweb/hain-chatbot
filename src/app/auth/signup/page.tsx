"use client";

import { BASE_URL } from "@/utils/api";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { setUser, clearUser } from "@/app/store/slices/userSlice";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showSignupFields, setShowSignupFields] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const router = useRouter();

  useEffect(() => {
    console.log("session in login page:", session);

    if (status === "authenticated" && session && !user) {
      const sendUserData = async () => {
        try {
          const result = await axios.post(
            `${BASE_URL}/google-login`,
            {
              name: session.user?.name,
              email: session.user?.email,
            },
            { withCredentials: true }
          );

          if (result.data.status) {
            dispatch(setUser(result.data.user));
          }
        } catch (err) {
          console.error("Error sending Google user data", err);
        }
      };

      sendUserData();
    }

    if (status === "unauthenticated") {
      console.log("Unauthenticated");
      dispatch(clearUser());
    }
  }, [session, status, dispatch, user]);

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleContinue = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !isValidEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    if (!showSignupFields) {
      setShowSignupFields(true);
      return;
    }

    if (!name || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log("signup res is", res);

      if (res.data.status) {
        router.push("/");
      } else {
        setErrorMessage(res.data.message || "Signup failed.");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      setErrorMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-black">Hain AI</h1>
      </div>

      <div
        className="flex items-center justify-center px-4"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-normal text-black mb-8">
              Create an account
            </h2>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-3xl border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {showSignupFields && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl border border-gray-300 text-black placeholder-gray-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl border border-gray-300 text-black placeholder-gray-500"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl border border-gray-300 text-black placeholder-gray-500"
                />
              </>
            )}

            {errorMessage && (
              <div className="text-red-600 text-sm text-center">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={
                isLoading ||
                !email ||
                (showSignupFields && (!name || !password || !confirmPassword))
              }
              className="w-full bg-black text-white py-3 rounded-3xl font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {isLoading ? "Processing..." : "Continue"}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-3 text-gray-500 font-medium">
                OR
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signIn("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-3xl py-3 hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-700 font-medium cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="text-center mt-12">
            <div className="text-xs text-gray-400">
              <a href="#" className="hover:underline">
                Terms of Use
              </a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
