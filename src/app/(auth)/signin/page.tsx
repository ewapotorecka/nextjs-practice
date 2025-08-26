import { SigninForm } from '@/components/auth/SigninForm';

export default function SigninPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign in to your account
        </h1>
        <SigninForm />
      </div>
    </div>
  );
}
