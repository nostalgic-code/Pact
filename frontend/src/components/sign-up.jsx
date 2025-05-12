import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Logo } from './logo';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Label } from '../../src/components/ui/label';
import { Link } from 'react-router-dom';

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        if (!passwordRegex.test(password)) {
            setError(
                "Password must be at least 8 characters, include one uppercase letter, one number, and one special character."
            );
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await signOut(auth);
            toast.success("Registration successful! Redirecting to login...", {
                position: "top-right",
                autoClose: 2000,
            });
            setError("");
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(err.message);
            toast.error(err.message, { position: "top-right" });
        }
    };

    return (
        <section className="flex min-h-screen bg-black px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                onSubmit={handleRegister}
                className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
            >
                <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                    <div className="text-center">
                        <Link to="/" aria-label="go home" className="mx-auto block w-fit">
                            <Logo />
                        </Link>
                        <h1 className="text-title mb-1 mt-4 text-xl font-semibold text-black dark:text-white">Create a Pact Account</h1>
                        <p className="text-sm text-black dark:text-white">Welcome! Create an account to get started</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm text-black dark:text-white">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="text-black dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="block text-sm text-black dark:text-white">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="text-black dark:text-white pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-500 text-xs" // ✅ Smaller text
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="block text-sm text-black dark:text-white">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="text-black dark:text-white pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-500 text-xs" // ✅ Smaller text
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </div>

                    <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <hr className="border-dashed" />
                        <span className="text-muted-foreground text-xs">Or continue With</span>
                        <hr className="border-dashed" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button type="button" variant="outline" className="text-black">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="0.98em"
                                height="1em"
                                viewBox="0 0 256 262"
                            >
                                <path
                                    fill="#4285f4"
                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                />
                                <path
                                    fill="#34a853"
                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                />
                                <path
                                    fill="#fbbc05"
                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                                />
                                <path
                                    fill="#eb4335"
                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                />
                            </svg>
                            <span>Google</span>
                        </Button>
                        <Button type="button" variant="outline" className="text-black">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 256 256"
                            >
                                <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z" />
                                <path fill="#80cc28" d="M256 121.666H134.335V0H256z" />
                                <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z" />
                                <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z" />
                            </svg>
                            <span>Microsoft</span>
                        </Button>
                    </div>
                </div>

                <div className="p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Have an account ?
                        <button
                            type="button"
                            className="px-2 text-blue-600 dark:text-blue-400"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </p>
                </div>
            </form>
        </section>
    );
}