import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mt-4 pt-4">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Estate-Ease. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
