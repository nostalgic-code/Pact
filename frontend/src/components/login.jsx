import { Logo } from './logo'
import { Button } from '../../src/components/ui/button'
import { Input } from '../../src/components/ui/input'
import { Label } from '../../src/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault() 

    try {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Login successful! Redirecting...');
        toast.success('Logged in successfully');
        setError('');
        setTimeout(() => {
            navigate('/dashboard', { replace: true });
            // ✅ React router handles the route change
        }, 2000);
        
    } catch (err) {
      setError('Invalid email or password. Please try again.')
      setMessage('')
    }
  }

  return (
    <section className="flex min-h-screen bg-black px-4 py-16 md:py-32 dark:bg-zinc-900">
      <form onSubmit={handleLogin} className="bg-white m-auto h-fit w-full max-w-sm overflow-hidden rounded-lg border shadow-md shadow-zinc-950/5 dark:bg-zinc-800 dark:border-zinc-700">
        <div className="bg-white -m-px rounded-lg border p-8 pb-6 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="text-center">
            <Link to="/" aria-label="go home" className="mx-auto block w-fit">
              <Logo />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold text-black dark:text-white">Sign In to  Pact</h1>
            <p className="text-sm text-black dark:text-zinc-300">Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm text-black dark:text-zinc-300">
                Email
              </Label>
              <Input 
                type="email" 
                required 
                name="email" 
                id="email" 
                className="text-black dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm text-black dark:text-zinc-300">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link to="#" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    Forgot your Password?
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="pwd"
                  id="pwd"
                  className="text-black dark:text-white pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </span>
              </div>
            </div>

            {message && <p className="text-green-600 text-center text-sm">{message}</p>}
            {error && <p className="text-red-600 text-center text-sm">{error}</p>}

            <Button type="submit" className="w-full bg-black hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-zinc-300 border-dashed dark:border-zinc-600" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Or continue With</span>
            <hr className="border-zinc-300 border-dashed dark:border-zinc-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262">
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
              </svg>
              <span>Google</span>
            </Button>
            <Button type="button" variant="outline" className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256">
                <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
                <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
                <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z"></path>
                <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z"></path>
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-700/30">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don't have an account?
            <Button asChild variant="link" className="px-2 text-blue-600 dark:text-blue-400">
              <Link to="/register">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}