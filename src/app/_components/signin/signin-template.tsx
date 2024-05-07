import BlueXBlueLogo from "@/app/_icons/bluex-blue-logo";

const SigninTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-dvh items-center justify-center bg-slate-50 px-5 font-header">
      <div className="flex h-[42.5rem] max-h-full w-[27.5rem] max-w-full flex-col rounded-2xl border border-solid border-border-light bg-white px-8 py-[3.125rem] shadow-lg">
        <h1 className="self-center text-center text-lg font-semibold text-main">
          Sign in to BlueX Open eBL
        </h1>
        <div className="mt-10 self-center lg:mt-[3.125rem]">
          <BlueXBlueLogo />
        </div>
        {children}
      </div>
    </main>
  );
};

export default SigninTemplate;
