const ErrorView = ({ message }: { message: string }) => {
  return (
    <div className="flex h-[48.125rem] flex-col items-center justify-center p-[3.125rem] text-main">
      <p className="mt-10 text-base font-semibold text-red-500">
        Error occurred
      </p>
      <p className="my-2.5 whitespace-nowrap text-[0.75rem] font-normal leading-[1.125rem]">
        {message}
      </p>
    </div>
  );
};

export default ErrorView;
