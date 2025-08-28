import { SignupForm } from '@/components/auth/SignUpForm';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
