import SignUpForm from "@/components/auth/SignupForm";

export default function Home() {
  return (
    <main className="flex flex-col space-y-10 md:space-y-20  mb-5">
      <SignUpForm />
    </main>
  );
}
