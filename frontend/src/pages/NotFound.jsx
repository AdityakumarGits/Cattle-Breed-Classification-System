const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-green-600">
        404
      </h1>

      <p className="mt-4 text-xl">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-6 rounded bg-green-500 px-4 py-2 text-white"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;