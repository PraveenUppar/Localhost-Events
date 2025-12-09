// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Join EventTicket.
          </h1>
          <p className="text-gray-500 mt-2">Create an account to book events</p>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-black hover:bg-gray-800 text-sm normal-case",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
