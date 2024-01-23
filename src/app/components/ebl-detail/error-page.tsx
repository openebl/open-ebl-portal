const ErrorPage = ({ message }: { message: string }) => {
  return (
    <div className="flex h-[20rem] items-center justify-between">{message}</div>
  );
};

export default ErrorPage;
