import { useState, useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Form } from '../../components/ui/form'
import { Button } from '../../components/ui/button'
import CustomInput from '../../components/CustomInput'
import { useUserStore } from '../../store/useUserStore'
import { loginFormSchema } from '../../lib/validators'

const SplashScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-2xl sm:text-3xl z-50">
    Loading...
  </div>
)

const LogIn = () => {
  const navigate = useNavigate()
  const { loginUser, loading } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  const schema = loginFormSchema()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '97512345',
      password: 'Test@123',
    },
  })

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true)
    try {
      await loginUser({
        identifier: data.identifier,
        password: data.password,
      })
      navigate('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (showSplash) return <SplashScreen />

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900 px-4 py-8">
      <div className="bg-gray-700 bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-xs sm:max-w-sm border border-white/20">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-base sm:text-lg tracking-widest text-white font-light">WELCOME</h1>
          <hr className="mt-2 border-white/20" />
        </header>

        <Form {...form}>
          <form className="space-y-5 sm:space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <CustomInput<z.infer<typeof schema>>
              control={form.control}
              name="identifier"
              label="CID Number"
              placeholder="Enter your CiD or Phone Number"
            />

            <CustomInput<z.infer<typeof schema>>
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button
              type="submit"
              disabled={isLoading || loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md font-semibold tracking-widest transition disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </Button>
          </form>
        </Form>

        <footer className="mt-6 text-center text-xs sm:text-sm text-white/80 leading-snug">
          Don&apos;t have an account? Please contact the Admin to create one.
        </footer>
      </div>
    </section>
  )
}

export default LogIn
