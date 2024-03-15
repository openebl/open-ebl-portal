const ErrorPage = ({ message }: { message: string }) => {
  return (
    <div className="flex h-[20rem] items-center justify-center">{message}</div>
  );
};

export default ErrorPage;
